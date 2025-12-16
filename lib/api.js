// API 调用封装

const API_BASE = '';

// 分析图片
export const analyzeImage = async (imageBase64, mediaType = 'image/jpeg') => {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64, mediaType }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze image');
  }
  
  return response.json();
};

// 翻译词汇
export const translateWords = async (words, targetLanguages) => {
  const response = await fetch(`${API_BASE}/api/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words, targetLanguages }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to translate');
  }
  
  return response.json();
};

// 同步数据
export const syncData = async (data) => {
  const response = await fetch(`${API_BASE}/api/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sync');
  }
  
  return response.json();
};

// 获取云端数据
export const fetchCloudData = async () => {
  const response = await fetch(`${API_BASE}/api/sync`);
  
  if (!response.ok) {
    if (response.status === 401) {
      return null; // 未登录
    }
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch data');
  }
  
  return response.json();
};

// 删除词汇
export const deleteVocabulary = async (vocabIds) => {
  const response = await fetch(`${API_BASE}/api/sync`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vocabIds }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete');
  }
  
  return response.json();
};
