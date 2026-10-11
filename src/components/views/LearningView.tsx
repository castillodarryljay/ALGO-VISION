import React, { useState } from 'react';
import { useAlgoStore } from '../../store/useAlgoStore';
import { LEARNING_LESSONS } from '../../engine/learningLessons';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  AlertTriangle, 
  ChevronRight,
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
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/80 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AlgoVision Learning Lab</h2>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Master fundamental algorithmic principles through interactive lessons, complexity intuitions, 
            pitfall breakdowns, and self-testing quizzes.
          </p>
        </div>

        {/* Difficulty Filters - Apple iOS Segmented Control */}
        <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-md">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                difficultyFilter === diff
                  ? 'bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 shadow-sm border border-black/[0.05] dark:border-white/10'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
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
          <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-zinc-400 px-1 mb-2">
            Curriculum Lessons ({filteredLessons.length})
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredLessons.map(lesson => {
              const isSelected = selectedLessonId === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 active:scale-98 flex items-center justify-between border ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/25 border-white/20'
                      : 'glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-white/10 border-white/80 dark:border-white/08'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs line-clamp-1">{lesson.title}</div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] opacity-80">
                      <span>{lesson.category}</span>
                      <span>•</span>
                      <span>{lesson.difficulty}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-0.5' : 'opacity-40'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Lesson Content */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Lesson Header Card */}
          <div className="glass-card rounded-3xl p-6 border border-white/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 backdrop-blur-md">
                  {currentLesson.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 backdrop-blur-md">
                  {currentLesson.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{currentLesson.title}</h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">{currentLesson.overview}</p>
            </div>

            <button
              onClick={handleLaunchVisualizer}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 shrink-0 active:scale-95 transition-all"
            >
              <span>Practice in Visualizer</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Core Concept Breakdown Card */}
          <div className="glass-card rounded-3xl p-6 border border-white/80 dark:border-white/10 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Core Concept & How It Works</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {currentLesson.coreIdea}
            </p>
          </div>

          {/* Complexity & Pitfalls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Complexity Intuition */}
            <div className="glass-card rounded-3xl p-5 border border-white/80 dark:border-white/10 shadow-sm space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-500" />
                <span>Complexity Intuition</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                {currentLesson.complexityAnalysis.intuition}
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                <div>Time: {currentLesson.complexityAnalysis.time}</div>
                <div>Space: {currentLesson.complexityAnalysis.space}</div>
              </div>
            </div>

            {/* Common Pitfalls */}
            <div className="glass-card rounded-3xl p-5 border border-white/80 dark:border-white/10 shadow-sm space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Common Pitfalls & Mistakes</span>
              </h3>
              <div className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed space-y-1">
                {currentLesson.commonMistakes.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 shrink-0">•</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Knowledge Check / Questions */}
          <div className="glass-card rounded-3xl p-6 border border-white/80 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-500" />
              <span>Knowledge Check & Quick Practice</span>
            </h3>

            <div className="space-y-4">
              {currentLesson.questions.map((quiz, qIdx) => {
                const userChoice = selectedAnswers[quiz.id];
                const isSubmitted = showFeedback[quiz.id];
                const isCorrect = userChoice === quiz.correctIndex;

                return (
                  <div key={quiz.id} className="p-4 rounded-2xl glass-subtle space-y-3">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">
                      {qIdx + 1}. {quiz.question}
                    </div>

                    <div className="space-y-1.5">
                      {quiz.options.map((opt, oIdx) => {
                        const isChosen = userChoice === oIdx;
                        let optionStyle = 'glass-card text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-white/10';
                        if (isSubmitted) {
                          if (oIdx === quiz.correctIndex) {
                            optionStyle = 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/50';
                          } else if (isChosen) {
                            optionStyle = 'bg-rose-500/20 text-rose-800 dark:text-rose-200 border-rose-500/50';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-200 border-cyan-500/50';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectAnswer(quiz.id, oIdx)}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 border ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {!isSubmitted ? (
                        <button
                          disabled={userChoice === undefined}
                          onClick={() => handleCheckAnswer(quiz.id, quiz.correctIndex)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs disabled:opacity-40 transition-all shadow-sm active:scale-95"
                        >
                          Check Answer
                        </button>
                      ) : (
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                        </div>
                      )}
                    </div>

                    {isSubmitted && (
                      <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed border border-black/[0.04] dark:border-white/[0.06]">
                        {quiz.explanation}
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
