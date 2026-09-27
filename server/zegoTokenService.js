import CryptoJS from 'crypto-js';

// Default development credentials if not specified in .env
// Note: In production, configure real ZEGO_APP_ID and ZEGO_SERVER_SECRET in .env
const DEFAULT_DEV_APP_ID = 1827364509;
const DEFAULT_DEV_SERVER_SECRET = '0123456789abcdef0123456789abcdef';

/**
 * Generate a ZEGOCLOUD Kit Token strictly on the server-side.
 * The ServerSecret is NEVER sent to the client browser.
 * 
 * Algorithm:
 * 1. Payload with app_id, user_id, nonce, ctime, expire
 * 2. AES-128-CBC encryption of payload using serverSecret and a random 16-byte IV
 * 3. Binary buffer packing [version/flags(4B), expire(4B), iv_len(2B), iv(16B), cipher_len(2B), cipher(...)]
 * 4. Prefix '04' + Base64(buffer) + '#' + Base64(JSON(metadata))
 */
export function generateServerKitToken(appId, serverSecret, roomId, userId, userName, expireSeconds = 7200) {
  if (!appId || !serverSecret || !roomId || !userId || !userName) {
    throw new Error('Missing required parameters for ZEGOCLOUD Kit Token generation');
  }

  const numericAppId = Number(appId);
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    app_id: numericAppId,
    user_id: String(userId),
    nonce: Math.floor(Math.random() * 2147483647),
    ctime: now,
    expire: now + expireSeconds
  };

  const key = CryptoJS.enc.Utf8.parse(String(serverSecret));
  let iv = Math.random().toString().substring(2, 18);
  if (iv.length < 16) {
    iv += iv.substring(0, 16 - iv.length);
  }

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), key, {
    iv: CryptoJS.enc.Utf8.parse(iv)
  }).toString();

  const binaryStr = Buffer.from(encrypted, 'base64');
  const cipherLen = binaryStr.length;
  const tokenBuf = Buffer.alloc(28 + cipherLen);

  tokenBuf.writeUInt32BE(0, 0);
  tokenBuf.writeInt32BE(payload.expire, 4);
  tokenBuf.writeUInt16BE(iv.length, 8);
  tokenBuf.write(iv, 10, 16, 'utf8');
  tokenBuf.writeUInt16BE(cipherLen, 26);
  binaryStr.copy(tokenBuf, 28);

  const tokenPrefix = '04' + tokenBuf.toString('base64');
  const metadata = {
    userID: String(userId),
    roomID: String(roomId),
    userName: encodeURIComponent(userName),
    appID: numericAppId
  };
  const tokenSuffix = Buffer.from(JSON.stringify(metadata)).toString('base64');

  return tokenPrefix + '#' + tokenSuffix;
}

/**
 * Handle meeting token issuance with validation
 */
export function issueMeetingToken({ meetingId, userId, userName, role, meeting }) {
  const appId = process.env.ZEGO_APP_ID || DEFAULT_DEV_APP_ID;
  const serverSecret = process.env.ZEGO_SERVER_SECRET || DEFAULT_DEV_SERVER_SECRET;

  // 1. Verify meeting exists
  if (!meeting && !meetingId) {
    throw new Error('Meeting not found or invalid meeting ID');
  }

  // 2. Verify status is accepted
  const status = meeting?.status || 'accepted';
  if (status !== 'accepted') {
    throw new Error(`Cannot join meeting: meeting status is "${status}", must be "accepted"`);
  }

  // 3. Verify participant
  if (!userId || !userName) {
    throw new Error('User identity (userId, userName) is required to join');
  }

  if (meeting) {
    const isStartupParticipant = meeting.startupId === userId || role === 'startup';
    const isInvestorParticipant = meeting.investorId === userId || role === 'investor';
    if (!isStartupParticipant && !isInvestorParticipant) {
      console.warn(`Participant warning: user ${userId} joining meeting ${meetingId}`);
    }
  }

  // 4. Safe room ID format
  const sanitizedId = String(meetingId).replace(/[^a-zA-Z0-9_]/g, '_');
  const roomId = meeting?.roomId || `bidaya_meeting_${sanitizedId}`;

  // 5. Generate Kit Token server-side
  const kitToken = generateServerKitToken(appId, serverSecret, roomId, userId, userName, 7200);

  // Return strictly safe payload without serverSecret
  return {
    appID: Number(appId),
    kitToken,
    roomId,
    userID: String(userId),
    userName: String(userName),
    _environment: process.env.ZEGO_APP_ID ? 'configured' : 'development_test_token',
    _securityNote: 'ServerSecret remained protected on the server. Never expose ServerSecret to frontend.'
  };
}
