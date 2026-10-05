import React from 'react';
import { MarketBlueprint as MarketBlueprintType } from '@/schemas/market.schema';
import { BlueprintLayout } from '../blueprint/BlueprintLayout';
import { BlueprintSection } from '../blueprint/BlueprintSection';
import { InsightCallout } from '../blueprint/InsightCallout';
import { EducationBlock } from '../blueprint/EducationBlock';
import { FAQAccordion } from '../blueprint/FAQAccordion';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, TrendingDown, Target, Clock, RefreshCw, BarChart2, BookOpen } from 'lucide-react';
import { generateMarketPDF } from '@/lib/utils/generateMarketPDF';

export const MarketBlueprint: React.FC<{ data: MarketBlueprintType; onRefresh?: () => void; isRefreshing?: boolean }> = ({ data, onRefresh, isRefreshing }) => {
  const getSentimentColor = (sentiment?: string) => {
    switch(sentiment?.toLowerCase()) {
      case 'bullish': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'bearish': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-[#42504F] bg-[#F6F3EC] border-[#E8E2D2]';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch(sentiment?.toLowerCase()) {
      case 'bullish': return <TrendingUp size={24} className="text-emerald-600" />;
      case 'bearish': return <TrendingDown size={24} className="text-rose-600" />;
      default: return <Minus size={24} className="text-[#42504F]" />;
    }
  };

  const formattedDate = new Date(data.generatedAt).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  
  const formattedTime = new Date(data.generatedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="w-full bg-white print:m-0 print:p-0">
      
      {/* PDF Cover Page */}
      <div className="hidden print:flex flex-col h-screen justify-center items-center text-center p-12 break-after-page">
        <h1 className="text-5xl font-bold text-[#0B2E33] mb-6">Market Intelligence Note</h1>
        <p className="text-xl text-[#42504F] mb-12">Analysis of today's key market events.</p>
        <div className="w-24 h-1 bg-[#0B2E33] mb-12"></div>
        <p className="text-[#6B7876] font-medium">Date: {formattedDate}</p>
        <p className="text-[#6B7876] font-medium mt-2">Overall Sentiment: {data.overallSentiment}</p>
        <p className="text-[#839F9D] mt-8 text-sm">Educational analysis only. Not financial advice.</p>
      </div>

      <BlueprintLayout>
        
        {/* Web Hero Section */}
        <div className="print:hidden border-b border-[#E8E2D2] pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-bold text-[#0B2E33] tracking-tight mb-2">Market Intelligence</h1>
              <p className="text-[#6B7876] text-lg flex items-center gap-2">
                <Clock size={18} /> {formattedDate} at {formattedTime}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => generateMarketPDF(data)}
                className="px-4 py-2 bg-[#0B2E33] text-white text-sm font-medium rounded-lg hover:bg-[#0F3A3F] transition-colors shadow-sm"
              >
                Download PDF
              </button>
              {onRefresh && (
                <button 
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="p-2 border border-[#E8E2D2] text-[#42504F] rounded-lg hover:bg-[#F6F3EC] transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                >
                  <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-5 rounded-xl border ${getSentimentColor(data.overallSentiment)} flex items-center gap-4`}>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                {getSentimentIcon(data.overallSentiment)}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Market Sentiment</p>
                <p className="text-2xl font-bold">{data.overallSentiment}</p>
              </div>
            </div>
            
            <div className="p-5 rounded-xl border border-[#E8E2D2] bg-[#F6F3EC] flex items-center gap-4 group relative cursor-help">
               <div className="p-3 bg-white rounded-lg shadow-sm border border-[#E8E2D2]">
                <Target size={24} className="text-[#B8873D]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6B7876] mb-1">Analysis Confidence</p>
                <p className="text-2xl font-bold text-[#0B2E33]">{data.confidenceScore}%</p>
              </div>
              {data.confidenceExplanation && (
                <div className="absolute top-full left-0 mt-2 w-72 p-3 bg-[#0F3A3F] text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 print:hidden pointer-events-none">
                  {data.confidenceExplanation}
                </div>
              )}
            </div>

            <div className="p-5 rounded-xl border border-[#E8E2D2] bg-[#F6F3EC] flex items-center gap-4">
               <div className="p-3 bg-white rounded-lg shadow-sm border border-[#E8E2D2]">
                <BarChart2 size={24} className="text-[#B8873D]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6B7876] mb-1">Stories Analyzed</p>
                <p className="text-2xl font-bold text-[#0B2E33]">{data.numberOfStoriesAnalyzed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <BlueprintSection title="Executive Summary" subtitle="The macro view at a glance">
          <div className="prose prose-slate max-w-none text-[#42504F] leading-relaxed text-lg print:text-black">
            {data.executiveSummary}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#6B7876] print:text-[#42504F]">
            <span className="font-semibold">Sources Analysed:</span> 
            {(data.sourcesAnalyzed || []).join(', ')}
          </div>
        </BlueprintSection>

        {/* Market Snapshot */}
        {(data.marketSnapshot || []).length > 0 && (
          <BlueprintSection title="Market Snapshot" subtitle="Key indices and commodity trends">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 print:grid-cols-3 print:gap-4 print:break-inside-avoid">
              {(data.marketSnapshot || []).map((idx, i) => (
                <div key={i} className="p-4 border border-[#E8E2D2] rounded-lg bg-white print:border-[#D9D2C3] flex flex-col items-center text-center">
                  <h4 className="text-xs font-bold text-[#6B7876] uppercase tracking-wider mb-2 print:text-[#42504F]">{idx.indexName}</h4>
                  <span className="font-mono text-lg font-bold text-[#0B2E33] print:text-black mb-1">{idx.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${idx.trend === 'up' ? 'text-emerald-600' : idx.trend === 'down' ? 'text-rose-600' : 'text-[#6B7876]'}`}>
                    {idx.trend === 'up' ? <ArrowUpRight size={14} /> : idx.trend === 'down' ? <ArrowDownRight size={14} /> : <Minus size={14} />}
                    <span>{idx.changeAmount > 0 ? '+' : ''}{idx.changeAmount.toFixed(2)} ({idx.changePercentage.toFixed(2)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </BlueprintSection>
        )}

        {/* Latest Market Articles */}
        {(data.rawNewsFeed || []).length > 0 && (
          <BlueprintSection title="Latest Market Articles" subtitle="Raw news feed aggregated from top publishers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:break-inside-avoid">
              {(data.rawNewsFeed || []).map((article, i) => (
                <div key={i} className="p-4 border border-[#E8E2D2] rounded-lg bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#F6F3EC] text-[#B8873D] text-[10px] font-bold uppercase tracking-wider rounded">
                        {article.publisher}
                      </span>
                      <span className="text-xs text-[#839F9D] font-medium">
                        {new Date(article.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <a href={article.url} target="_blank" rel="noreferrer" className="group">
                      <h4 className="font-bold text-[#0B2E33] leading-tight mb-2 group-hover:text-[#B8873D] transition-colors line-clamp-2">
                        {article.headline}
                      </h4>
                    </a>
                    <p className="text-sm text-[#42504F] line-clamp-3 mb-4">
                      {article.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E8E2D2] pt-3">
                    <div className="flex gap-1">
                      {article.categories?.slice(0, 2).map((cat, idx) => (
                        <span key={idx} className="text-[10px] text-[#6B7876] bg-[#EFEAE0] px-2 py-0.5 rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <a href={article.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#B8873D] flex items-center gap-1 hover:text-[#B8873D]">
                      Read original <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </BlueprintSection>
        )}

        {/* AI Market Analysis */}
        <BlueprintSection title="AI Market Analysis" subtitle="Deep dive into today's major events">
          <div className="space-y-12">
            {(data.aiAnalysis || []).map((analysis, i) => {
              const story = data.topStories[i];
              if (!story) return null;
              
              return (
                <div key={i} className="print:break-inside-avoid">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block px-3 py-1 bg-[#EFEAE0] text-[#0B2E33] text-xs font-bold rounded-full print:border print:border-[#D9B978]">Event {i+1}</span>
                      {story.publisher && (
                        <span className="text-xs font-medium text-[#6B7876] bg-[#EFEAE0] px-2 py-1 rounded-md">{story.publisher}</span>
                      )}
                      {story.publishedTime && (
                        <span className="text-xs text-[#839F9D]">{new Date(story.publishedTime).toLocaleDateString()}</span>
                      )}
                    </div>
                    {story.originalUrl ? (
                      <a href={story.originalUrl} target="_blank" rel="noreferrer" className="hover:text-[#B8873D] transition-colors">
                        <h3 className="text-2xl font-bold text-[#0B2E33] mb-3 print:text-black">{story.headline}</h3>
                      </a>
                    ) : (
                      <h3 className="text-2xl font-bold text-[#0B2E33] mb-3 print:text-black">{story.headline}</h3>
                    )}
                    <p className="text-[#42504F] italic border-l-4 border-[#E8E2D2] pl-4 py-1 print:text-[#0B2E33]">{story.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F6F3EC] p-6 rounded-xl border border-[#E8E2D2] print:bg-white print:border-[#D9D2C3]">
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#6B7876] mb-2">What Happened</h4>
                        <p className="text-[#0B2E33] print:text-black leading-relaxed">{analysis.whatHappened}</p>
                        {analysis.supportingSources && analysis.supportingSources.length > 0 && (
                          <p className="mt-2 text-xs text-[#6B7876]"><strong>Sources:</strong> {analysis.supportingSources.join(', ')}</p>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#6B7876] mb-2">Why It Happened</h4>
                        <p className="text-[#0B2E33] print:text-black leading-relaxed">{analysis.whyItHappened}</p>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#6B7876] mb-2">Economic & Sector Implications</h4>
                        <p className="text-[#0B2E33] print:text-black leading-relaxed mb-3">{analysis.economicImplications}</p>
                        <p className="text-[#0B2E33] print:text-black leading-relaxed">{analysis.sectorImplications}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </BlueprintSection>

        {/* Sector Impact */}
        {(data.sectorImpacts || []).length > 0 && (
          <BlueprintSection title="Sector Impact Tracker" subtitle="How events are rippling across industries">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:break-inside-avoid">
              {(data.sectorImpacts || []).map((impact, i) => {
                const getSectorBg = (dir: string) => {
                  if (dir === 'Positive') return 'bg-emerald-50 border-emerald-200 print:border-emerald-500';
                  if (dir === 'Negative') return 'bg-rose-50 border-rose-200 print:border-rose-500';
                  return 'bg-[#F6F3EC] border-[#E8E2D2] print:border-[#839F9D]';
                };
                const getSectorText = (dir: string) => {
                  if (dir === 'Positive') return 'text-emerald-700';
                  if (dir === 'Negative') return 'text-rose-700';
                  return 'text-[#42504F]';
                };
                
                return (
                  <div key={i} className={`p-5 rounded-xl border ${getSectorBg(impact.direction)} flex flex-col`}>
                    <div className="flex justify-between items-start mb-3 border-b border-black/5 pb-3">
                      <h4 className={`font-bold text-lg ${getSectorText(impact.direction)}`}>{impact.sector}</h4>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${impact.direction === 'Positive' ? 'bg-emerald-200/50' : impact.direction === 'Negative' ? 'bg-rose-200/50' : 'bg-[#EFEAE0]/50'}`}>
                          {impact.direction}
                        </span>
                        <span className="text-[10px] text-[#6B7876] mt-1 uppercase font-bold opacity-70">Conf: {impact.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#0B2E33] mb-2">{impact.expectedImpact}</p>
                    <p className="text-sm text-[#42504F] leading-relaxed print:text-[#0B2E33]">{impact.explanation}</p>
                    {impact.supportingSources && impact.supportingSources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-black/5">
                        <p className="text-[10px] uppercase font-bold text-[#839F9D]">Supporting Evidence</p>
                        <p className="text-xs text-[#42504F] font-medium">{impact.supportingSources.join(', ')}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </BlueprintSection>
        )}

        {/* Emerging Themes */}
        {(data.emergingThemes || []).length > 0 && (
          <BlueprintSection title="Emerging Market Themes" subtitle="Connecting the dots across stories">
            <div className="space-y-4 print:break-inside-avoid">
              {(data.emergingThemes || []).map((theme, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 p-6 border border-[#E8E2D2] rounded-xl bg-white print:border-[#D9D2C3]">
                  <div className="md:w-1/3 md:border-r border-[#E8E2D2] pr-4 print:border-[#D9D2C3]">
                    <h4 className="font-bold text-xl text-[#0B2E33] mb-2 print:text-black">{theme.themeName}</h4>
                    <p className="text-sm text-[#6B7876] font-medium print:text-[#42504F]">Related Stories:</p>
                    <ul className="text-sm text-[#42504F] list-disc pl-4 mt-1 space-y-1 print:text-[#0B2E33]">
                      {theme.stories.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="md:w-2/3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#839F9D] mb-2 print:text-[#42504F]">Overarching Impact</h5>
                    <p className="text-[#42504F] leading-relaxed print:text-black">{theme.overarchingImpact}</p>
                  </div>
                </div>
              ))}
            </div>
          </BlueprintSection>
        )}

        {/* Historical Context */}
        <BlueprintSection title="Historical Context" subtitle="Learning from past market cycles">
          {(!data.historicalContexts || data.historicalContexts.length === 0) ? (
            <div className="p-8 bg-[#F6F3EC] border border-[#E8E2D2] rounded-xl text-center text-[#6B7876] italic">
              No significant historical comparison identified for today's developments.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 print:break-inside-avoid">
              {(data.historicalContexts || []).map((hc, i) => (
                <div key={i} className="relative pl-8 border-l-2 border-[#E8E2D2] print:border-[#D9B978] py-2">
                  <div className="absolute w-4 h-4 bg-[#0B2E33] rounded-full -left-[9px] top-4 shadow-[0_0_0_4px_white] print:shadow-none"></div>
                  <h4 className="text-lg font-bold text-[#0B2E33] mb-2 print:text-black">{hc.historicalEvent}</h4>
                  <p className="text-[#42504F] mb-4 print:text-[#0B2E33]">{hc.whatHappenedThen}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#F6F3EC] p-4 rounded-lg border border-[#E8E2D2] print:bg-white print:border-[#D9D2C3]">
                      <h5 className="text-xs font-bold text-[#6B7876] uppercase tracking-wider mb-2">Similarities</h5>
                      <ul className="text-sm text-[#42504F] list-disc pl-4 space-y-1">
                        {hc.similarities.map((s, idx) => <li key={idx}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="bg-[#F6F3EC] p-4 rounded-lg border border-[#E8E2D2] print:bg-white print:border-[#D9D2C3]">
                      <h5 className="text-xs font-bold text-[#6B7876] uppercase tracking-wider mb-2">Differences</h5>
                      <ul className="text-sm text-[#42504F] list-disc pl-4 space-y-1">
                        {hc.differences.map((d, idx) => <li key={idx}>{d}</li>)}
                      </ul>
                    </div>
                  </div>
                  <InsightCallout type="strength" title="Key Lesson">
                    {hc.keyLesson}
                  </InsightCallout>
                </div>
              ))}
            </div>
          )}
        </BlueprintSection>

        {/* What to Watch Next */}
        {(data.whatToWatchNext || []).length > 0 && (
          <BlueprintSection title="What to Watch Next" subtitle="Upcoming events to monitor">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:break-inside-avoid">
              {(data.whatToWatchNext || []).map((watch, i) => (
                <div key={i} className="flex gap-4 p-4 border border-[#E8E2D2] rounded-xl bg-white print:border-[#D9D2C3]">
                   <div className="shrink-0 pt-1 text-[#B8873D]">
                     <Clock size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-[#0B2E33] text-sm print:text-black">{watch.event}</h4>
                     <p className="text-xs font-medium text-[#B8873D] mb-2">{watch.expectedDate}</p>
                     <p className="text-sm text-[#42504F] print:text-[#0B2E33]">{watch.whyMonitor}</p>
                   </div>
                </div>
              ))}
            </div>
          </BlueprintSection>
        )}

        {/* Investor Takeaways */}
        <BlueprintSection title="Investor Takeaways" subtitle="Educational insights for long-term perspective">
           <div className="grid grid-cols-1 gap-6 print:break-inside-avoid">
             {(data.investorTakeaways || []).map((takeaway, i) => (
               <div key={i} className="p-6 bg-[#0B2E33] rounded-xl text-white print:bg-white print:border-2 print:border-black print:text-black">
                 <div className="flex items-center gap-3 mb-4 border-b border-[#0F3A3F] print:border-[#D9D2C3] pb-3">
                   <BookOpen size={20} className="text-[#B8873D] print:text-[#B8873D]" />
                   <h4 className="font-bold text-lg">{takeaway.concept}</h4>
                 </div>
                 <div className="space-y-4">
                   <div>
                     <h5 className="text-xs font-bold uppercase tracking-wider text-[#839F9D] print:text-[#42504F] mb-1">Why It Matters</h5>
                     <p className="text-sm text-[#D9B978] print:text-[#0B2E33] leading-relaxed">{takeaway.whyItMatters}</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#0F3A3F] print:border-[#D9D2C3]">
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400 print:text-rose-700 mb-1">Common Misconceptions</h5>
                        <p className="text-sm text-[#D9B978] print:text-[#0B2E33]">{takeaway.commonMisconceptions}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700 mb-1">Long-Term Perspective</h5>
                        <p className="text-sm text-[#D9B978] print:text-[#0B2E33]">{takeaway.longTermPerspective}</p>
                      </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </BlueprintSection>

        <hr className="border-t border-[#E8E2D2] print:border-[#D9D2C3] my-10" />

        <BlueprintSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 print:block">
            <div className="lg:col-span-7 print:mb-12 print:break-inside-avoid">
               <h3 className="font-serif text-2xl font-medium mb-6 text-[#0B2E33] print:text-black">
                Analysis Assumptions & Methodology
              </h3>
              <ul className="text-sm text-[#42504F] space-y-3 list-disc pl-5 print:text-[#42504F]">
                {(data.assumptions || []).map((assumption, i) => (
                  <li key={i}>{assumption}</li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5 print:break-inside-avoid">
              <h3 className="font-serif text-2xl font-medium mb-6 text-[#0B2E33] print:text-black">
                Contextual FAQs
              </h3>
              <FAQAccordion faqs={data.faqs || []} />
            </div>
          </div>
        </BlueprintSection>

      </BlueprintLayout>
    </div>
  );
};
