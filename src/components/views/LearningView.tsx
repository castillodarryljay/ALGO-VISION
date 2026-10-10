import React, { useState } from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { LEARNING_LESSONS } from '../../engine/learningLessons';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Lightbulb, 
  AlertTriangle, 
  ShieldAlert,
  ChevronRight,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LearningView: React.FC = () => {
  const { selectAlgorithm, setSection } = useAlgoStore();

  const [selectedLessonId, setSelectedLessonId] = useState<string>(LEARNING_LESSONS[0].id);
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  const filteredLessons = difficultyFilter === 'All' 
    ? LEARNING_LESSONS 
    : LEARNING_LESSONS.filter(l => l.difficulty === difficultyFilter);

  const currentLesson = LEARNING_LESSONS.find(l => l.id === selectedLessonId) || LEARNING_LESSONS[0];

  const handleSelectAnswer = (qId: string, optIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleCheckAnswer = (qId: string, correctIndex: number) => {
    setShowFeedback(prev => ({ ...prev, [qId]: true }));
    if (selectedAnswers[qId] === correctIndex) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  };

  const handleLaunchVisualizer = () => {
    selectAlgorithm(currentLesson.algorithmId);
    setSection(currentLesson.category.toLowerCase().includes('search') ? 'searching' : 'sorting');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 text-xs">
      
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">AlgoVision Learning Lab</h2>
          </div>
          <p className="text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Master fundamental algorithmic principles through interactive lessons, complexity intuitions, 
            pitfall breakdowns, and self-testing quizzes.
          </p>
        </div>

        {/* Difficulty Filters */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                difficultyFilter === diff
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Main Learning Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Lesson Index */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-[11px] uppercase font-bold text-zinc-500 px-1 mb-2">
            Curriculum Lessons ({filteredLessons.length})
          </div>

          <div className="space-y-1.5">
            {filteredLessons.map(lesson => {
              const isSelected = lesson.id === currentLesson.id;
              let diffBadgeColor = 'bg-blue-950 text-blue-300 border-blue-800';
              if (lesson.difficulty === 'Intermediate') diffBadgeColor = 'bg-amber-950 text-amber-300 border-amber-800';
              if (lesson.difficulty === 'Advanced') diffBadgeColor = 'bg-rose-950 text-rose-300 border-rose-800';

              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonId(lesson.id);
                    setSelectedAnswers({});
                    setShowFeedback({});
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-md shadow-cyan-950 ring-1 ring-cyan-500/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-400 font-mono">{lesson.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${diffBadgeColor}`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-zinc-100">{lesson.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Lesson Viewer */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Lesson Hero Banner */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                {currentLesson.difficulty} Level
              </span>
              <button
                onClick={handleLaunchVisualizer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors shadow-sm"
              >
                <span>Open in Visualizer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">{currentLesson.title}</h3>
            <p className="text-zinc-300 mt-2 text-xs leading-relaxed max-w-2xl">{currentLesson.overview}</p>
          </div>

          {/* Core Idea & Step-by-Step Explanation */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>The Core Algorithmic Intuition</span>
              </div>
              <p className="text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800 leading-relaxed">
                {currentLesson.coreIdea}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Step-by-Step Execution Sequence</span>
              </div>
              <div className="space-y-1.5">
                {currentLesson.stepByStepExplanation.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-zinc-300 leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Complexity Breakdown */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="font-semibold text-zinc-200">Complexity Analysis & Theoretical Proof</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-sans">Time Complexity</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">{currentLesson.complexityAnalysis.time}</div>
              </div>
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-sans">Auxiliary Space Complexity</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">{currentLesson.complexityAnalysis.space}</div>
              </div>
            </div>
            <p className="text-zinc-400 text-xs bg-zinc-950 p-3 rounded border border-zinc-800 leading-relaxed font-sans">
              <strong className="text-zinc-200">Intuition: </strong> {currentLesson.complexityAnalysis.intuition}
            </p>
          </div>

          {/* Advantages vs Limitations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span>Key Advantages</span>
              </div>
              <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                {currentLesson.advantages.map((adv, i) => (
                  <li key={i}>{adv}</li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 font-semibold text-rose-400 mb-2">
                <XCircle className="w-4 h-4" />
                <span>Limitations & Trade-offs</span>
              </div>
              <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                {currentLesson.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Common Pitfalls & Mistakes */}
          <div className="bg-zinc-900 border border-amber-900/60 rounded-xl p-4">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Common Pitfalls & Coding Interview Traps</span>
            </div>
            <ul className="space-y-1.5 text-zinc-300">
              {currentLesson.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">⚠</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Practice Questions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-2 font-semibold text-zinc-200 text-sm">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Check Your Understanding (Practice Questions)</span>
            </div>

            <div className="space-y-6">
              {currentLesson.questions.map((q, qIdx) => {
                const userChoice = selectedAnswers[q.id];
                const isSubmitted = showFeedback[q.id];
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div key={q.id} className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="font-semibold text-zinc-200">
                      Q{qIdx + 1}. {q.question}
                    </div>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        let optionStyle = 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300';

                        if (isSelected && !isSubmitted) {
                          optionStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-200';
                        } else if (isSubmitted) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-semibold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => !isSubmitted && handleSelectAnswer(q.id, optIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && optIdx === q.correctIndex && (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {isSubmitted && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!isSubmitted ? (
                      <button
                        onClick={() => userChoice !== undefined && handleCheckAnswer(q.id, q.correctIndex)}
                        disabled={userChoice === undefined}
                        className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs shadow-xs"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                        isCorrect ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'
                      }`}>
                        <strong>{isCorrect ? '✓ Correct!' : '✗ Incorrect.'} </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
