const API_URL = 'https://nlob2ghdyk.execute-api.ap-northeast-2.amazonaws.com';

// 사용자 ID 가져오기
const getUserId = () => {
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

// 모든 후기 조회
export const getAllReviews = async () => {
  const response = await fetch(`${API_URL}/reviews`);
  const data = await response.json();
  return data.reviews || [];
};

// 내 후기 조회
export const getMyReviews = async () => {
  const userId = getUserId();
  if (!userId) throw new Error('로그인이 필요합니다');
  
  const response = await fetch(`${API_URL}/reviews/my?userId=${userId}`);
  const data = await response.json();
  return data.reviews || [];
};

// 후기 작성
export const createReview = async (title, content, city = '서울', type = '후기') => {
  const userId = getUserId();
  if (!userId) throw new Error('로그인이 필요합니다');
  
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, title, content, city, type })
  });
  
  const data = await response.json();
  return data.review;
};

// 후기 삭제
export const deleteReview = async (reviewId) => {
  const userId = getUserId();
  if (!userId) throw new Error('로그인이 필요합니다');
  
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, reviewId })
  });
  
  return response.json();
};
