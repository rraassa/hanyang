const API_URL = 'https://nlob2ghdyk.execute-api.ap-northeast-2.amazonaws.com';

// 사용자 ID 가져오기
export const getCurrentUserId = () => {
  const idToken = localStorage.getItem('idToken');
  const kakaoId = localStorage.getItem('kakaoId');
  
  if (kakaoId) return `kakao_${kakaoId}`;
  
  if (idToken) {
    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return payload.sub || payload.email;
    } catch (e) {
      return null;
    }
  }
  
  return null;
};

export const isAdminUser = () => {
  const idToken = localStorage.getItem('idToken');
  if (!idToken) return false;

  try {
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    const groups = payload?.['cognito:groups'] || [];
    return Array.isArray(groups) && groups.some((g) => String(g).toLowerCase() === 'admin');
  } catch (e) {
    return false;
  }
};

// 모든 후기 조회
export const getAllReviews = async () => {
  const response = await fetch(`${API_URL}/reviews`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || '후기 목록 조회에 실패했습니다.');
  }
  return data.reviews || [];
};

// 내 후기 조회
export const getMyReviews = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('로그인이 필요합니다');
  
  const response = await fetch(`${API_URL}/reviews/my?userId=${userId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || '내 후기 조회에 실패했습니다.');
  }
  return data.reviews || [];
};

// 후기 작성
export const createReview = async (title, content, city = '서울', type = '후기', imageUrl = '') => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('로그인이 필요합니다');
  
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, title, content, city, type, imageUrl })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || '후기 작성에 실패했습니다.');
  }
  return data.review;
};

// 후기 삭제
export const deleteReview = async (reviewId, targetUserId) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('로그인이 필요합니다');

  const admin = isAdminUser();
  const ownerUserId = targetUserId || userId;
  
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, reviewId, targetUserId: ownerUserId, isAdmin: admin })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || '후기 삭제에 실패했습니다.');
  }
  return data;
};

// 후기 수정 (본인만 가능)
export const updateReview = async (reviewId, title, content) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('로그인이 필요합니다');

  const response = await fetch(`${API_URL}/reviews`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, reviewId, title, content })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || '후기 수정에 실패했습니다.');
  }
  return data.review;
};
