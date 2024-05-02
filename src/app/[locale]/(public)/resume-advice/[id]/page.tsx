'use client';

import { Container } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type AnalysisResult = {
  strengths: string;
  weaknesses: string;
  suggestions: string;
};

function JobListingPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  useEffect(() => {
    // 模擬從後端獲取的履歷分析結果
    const mockAnalysisResult = {
      strengths: '良好的組織能力和團隊合作精神。',
      weaknesses: '缺乏國際工作經驗。',
      suggestions: '考慮增加一些與國際項目相關的經歷或技能。',
    };

    setAnalysisResult(mockAnalysisResult);
  }, [locale]);

  // 展示分析結果
  return (
    <Container maxW="container.md" py={10} w="100%">
      <div>
        <h2>履歷健檢結果</h2>
        <p>
          <strong>優點：</strong>
          {analysisResult?.strengths}
        </p>
        <p>
          <strong>缺點：</strong>
          {analysisResult?.weaknesses}
        </p>
        <p>
          <strong>建議：</strong>
          {analysisResult?.suggestions}
        </p>
      </div>
    </Container>
  );
}

export default JobListingPage;
