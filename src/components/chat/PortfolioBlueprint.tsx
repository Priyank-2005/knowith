import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { BlueprintLayout } from '../blueprint/BlueprintLayout';
import { BlueprintHero } from '../blueprint/BlueprintHero';
import { BlueprintSection } from '../blueprint/BlueprintSection';
import { MetricStrip } from '../blueprint/MetricStrip';
import { InsightCallout } from '../blueprint/InsightCallout';
import { RoadmapTimeline } from '../blueprint/RoadmapTimeline';
import { EducationBlock } from '../blueprint/EducationBlock';
import { FAQAccordion } from '../blueprint/FAQAccordion';
import { PortfolioBlueprint as PortfolioBlueprintType } from '@/schemas/portfolio.schema';
import { generatePortfolioPDF } from '@/lib/utils/generatePortfolioPDF';

const COLORS = ['#0B2E33', '#B8873D', '#5E8C82', '#D9B978', '#7A2331', '#839F9D']; // brand: ink, gold, sage, light gold, maroon, muted

export const PortfolioBlueprint: React.FC<{ data: PortfolioBlueprintType }> = ({ data }) => {
  
  // Format allocation data for Recharts
  const allocationData = Object.keys(data.currentAllocation || {}).map(asset => ({
    name: asset,
    Current: (data.currentAllocation as any)[asset],
    Recommended: (data.recommendedAllocation as any)?.[asset] || (data.currentAllocation as any)[asset]
  }));

  return (
    <div className="w-full bg-white">
      <BlueprintLayout>
        
        <BlueprintHero 
          title="Portfolio Intelligence Blueprint"
          subtitle={`A comprehensive wealth management analysis tailored for a ${data.investmentPersonality}.`}
          primaryMetric={data.overallScore}
          primaryMetricLabel="Health Score"
          onDownload={() => generatePortfolioPDF(data)}
        />

        <BlueprintSection title="Portfolio Health Scores" subtitle={data.scoreMethodology}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {data.subScores?.map((s, idx) => (
              <div key={idx} className="p-6 border border-[#E8E2D2] rounded-xl bg-[#F6F3EC] print:bg-white print:border-[#D9D2C3]">
                <div className="flex justify-between items-end mb-4">
                  <h4 className="font-semibold text-[#0B2E33] text-lg print:text-black">{s.name}</h4>
                  <span className="text-2xl font-serif text-[#B8873D] print:text-[#0B2E33]">{s.score}/100</span>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-[#42504F] print:text-[#0B2E33]">Analysis:</strong> <span className="text-[#42504F] print:text-[#0B2E33]">{s.explanation}</span></p>
                  <p><strong className="text-[#42504F] print:text-[#0B2E33]">Why it matters:</strong> <span className="text-[#42504F] print:text-[#0B2E33]">{s.whyItMatters}</span></p>
                </div>
              </div>
            ))}
          </div>
        </BlueprintSection>

        <BlueprintSection title="Executive Summary" subtitle="Your current positioning and high-level strategy">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <InsightCallout type="insight" title={data.investmentPersonality}>
              {data.personalityReasoning}
            </InsightCallout>
            <InsightCallout type="neutral" title="Total Analyzed Value">
              <span className="text-2xl font-serif">{data.totalValue}</span>
            </InsightCallout>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-[#0B2E33] print:text-black">Portfolio Strengths</h4>
              {data.strengths?.map((strength, i) => (
                <InsightCallout key={i} type="strength">{strength}</InsightCallout>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-[#0B2E33] print:text-black">Areas of Concern</h4>
              {data.areasOfConcern?.map((concern, i) => (
                <InsightCallout key={i} type="risk">{concern}</InsightCallout>
              ))}
            </div>
          </div>
        </BlueprintSection>

        <BlueprintSection title="Asset Allocation Strategy" subtitle="Current vs Recommended Asset Mix">
          <div className="h-96 w-full mb-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{fill: '#6B7876'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6B7876'}} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <RechartsTooltip 
                  cursor={{fill: '#F6F3EC'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Current" fill="#B3C1BF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recommended" fill="#0B2E33" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-[#0B2E33] mb-4 print:text-black">Diversification Analysis</h4>
              <p className="text-[#42504F] leading-relaxed print:text-[#0B2E33]">{data.diversificationAnalysis}</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#0B2E33] mb-4 print:text-black">Concentration Risks</h4>
              <p className="text-[#42504F] leading-relaxed print:text-[#0B2E33]">{data.concentrationRisks}</p>
            </div>
          </div>
        </BlueprintSection>

        <BlueprintSection title="Macroeconomic Scenario Analysis" subtitle="How your portfolio behaves under stress">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.scenarios?.map((scenario, i) => (
              <div key={i} className="p-6 border border-[#E8E2D2] rounded-xl bg-[#F6F3EC] print:bg-white print:border-[#D9D2C3]">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-[#0B2E33] text-lg print:text-black">{scenario.name}</h4>
                  <span className="px-2 py-1 bg-[#EFEAE0] text-[#B8873D] text-xs font-bold uppercase rounded-md print:border print:border-[#E8E2D2]">
                    Confidence: {scenario.confidence}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-[#42504F] print:text-[#0B2E33]">Expected Behaviour:</strong> <span className="text-[#42504F] print:text-[#0B2E33]">{scenario.expectedBehaviour}</span></p>
                  <p><strong className="text-[#42504F] print:text-[#0B2E33]">Risks:</strong> <span className="text-[#42504F] print:text-[#0B2E33]">{scenario.risks}</span></p>
                  <p><strong className="text-[#42504F] print:text-[#0B2E33]">Suggested Action:</strong> <span className="text-[#42504F] print:text-[#0B2E33]">{scenario.suggestedAction}</span></p>
                </div>
              </div>
            ))}
          </div>
        </BlueprintSection>

        <BlueprintSection title="Rebalancing Roadmap" subtitle="Strategic steps to achieve your target allocation">
          <RoadmapTimeline steps={
            data.rebalancingRoadmap?.map(step => ({
              timeframe: step.timeframe,
              action: `[${step.priority}] Rebalance ${step.assetClass}: ${step.recommendation}`,
              impact: `Problem: ${step.problem} → Benefit: ${step.expectedBenefit} (Estimated Effort: ${step.estimatedEffort || 'Unknown'})`
            })) || []
          } />
        </BlueprintSection>

        <BlueprintSection title="Long-Term Strategy & Assumptions">
          <div className="prose prose-slate max-w-none print:text-black">
            <p className="text-lg leading-relaxed text-[#42504F] mb-8 print:text-[#0B2E33]">{data.longTermStrategy}</p>
            
            <h4 className="font-semibold text-sm uppercase tracking-widest text-[#839F9D] mb-4 print:text-[#42504F]">Analysis Assumptions</h4>
            <ul className="text-sm text-[#6B7876] space-y-2 list-disc pl-5 print:text-[#42504F]">
              {data.analysisAssumptions?.map((assumption, i) => (
                <li key={i}>{assumption}</li>
              ))}
            </ul>
          </div>
        </BlueprintSection>

        <hr className="border-t border-[#E8E2D2] print:border-[#D9D2C3] my-10" />

        <BlueprintSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <EducationBlock 
                title={data.educationalTopic?.title || 'Portfolio Concepts'}
                content={data.educationalTopic?.personalizedContent || ''}
              />
            </div>
            <div className="lg:col-span-5">
              <h3 className="font-serif text-2xl font-medium mb-6 text-[#0B2E33] print:text-black">
                Strategic FAQs
              </h3>
              <FAQAccordion faqs={data.faqs || []} />
            </div>
          </div>
        </BlueprintSection>

      </BlueprintLayout>
    </div>
  );
};
