/**
 * Learning mode course types and questions
 */

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningLesson {
  id: string;
  algorithmId: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  overview: string;
  coreIdea: string;
  stepByStepExplanation: string[];
  complexityAnalysis: {
    time: string;
    space: string;
    intuition: string;
  };
  advantages: string[];
  limitations: string[];
  commonMistakes: string[];
  relatedAlgorithms: string[];
  questions: PracticeQuestion[];
}
