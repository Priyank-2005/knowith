import React from 'react';
import { BlueprintLayout } from '../blueprint/BlueprintLayout';
import { BlueprintHero } from '../blueprint/BlueprintHero';
import { BlueprintSection } from '../blueprint/BlueprintSection';
import { InsightCallout } from '../blueprint/InsightCallout';
import { RoadmapTimeline } from '../blueprint/RoadmapTimeline';
import { EducationBlock } from '../blueprint/EducationBlock';
import { FAQAccordion } from '../blueprint/FAQAccordion';
import { TaxBlueprint as TaxBlueprintType } from '@/schemas/tax.schema';
import { generateTaxPDF } from '@/lib/utils/generateTaxPDF';

export const TaxBlueprint: React.FC<{ data: TaxBlueprintType }> = ({ data }) => {
  return (
    <div className="w-full bg-white print:m-0 print:p-0">
      {/* Cover Page for PDF */}
      <div className="hidden print:flex flex-col h-screen justify-center items-center text-center p-12 break-after-page">
        <h1 className="text-5xl font-bold text-[#0B2E33] mb-6">Tax Strategy Blueprint</h1>
        <p className="text-xl text-[#42504F] mb-12">Prepared exclusively for your financial profile.</p>
        <div className="w-24 h-1 bg-[#0B2E33] mb-12"></div>
        <p className="text-[#6B7876] font-medium">Date: {data.preparedDate}</p>
        <p className="text-[#839F9D] mt-4 text-sm">Strictly Private and Confidential</p>
      </div>

      <BlueprintLayout>
        <div className="print:hidden">
          <BlueprintHero 
            title="Tax Strategy Blueprint"
            subtitle="A comprehensive tax optimization plan tailored for your financial profile."
            primaryMetric={`₹${data.totalTaxLiability.toLocaleString('en-IN')}`}
            primaryMetricLabel="Estimated Tax Liability"
            onDownload={() => generateTaxPDF(data)}
          />
        </div>

        <div className="hidden print:block mb-8">
           <h2 className="text-3xl font-bold text-[#0B2E33] border-b pb-4 mb-4">Tax Strategy Overview</h2>
        </div>

        <BlueprintSection title="Executive Summary">
          <div className="prose prose-slate max-w-none text-[#42504F] leading-relaxed print:text-black">
            {data.executiveSummary}
          </div>
          {data.potentialTaxSavings > 0 && (
            <div className="mt-6">
              <InsightCallout type="strength" title="Potential Savings Identified">
                By implementing the suggested roadmap, you can potentially save ₹{data.potentialTaxSavings.toLocaleString('en-IN')} in taxes.
              </InsightCallout>
            </div>
          )}
        </BlueprintSection>

        <BlueprintSection title="Tax Efficiency Score" subtitle="How effectively your wealth is structured for tax optimization">
          <div className="flex flex-col md:flex-row gap-8 items-center bg-[#F6F3EC] rounded-2xl p-8 border border-[#E8E2D2] print:bg-white print:border-[#D9D2C3] print:break-inside-avoid">
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-[#E8E2D2] print:border-[#E8E2D2]">
                <span className="text-4xl font-bold text-[#B8873D] print:text-[#0B2E33]">{data.taxEfficiencyScore.score}</span>
              </div>
              <span className="text-xs font-bold text-[#6B7876] mt-3 tracking-widest uppercase">Out of 100</span>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div>
                <h4 className="text-sm font-semibold text-[#6B7876] uppercase tracking-wider print:text-[#42504F]">Analysis</h4>
                <p className="text-[#0B2E33] text-lg print:text-black leading-relaxed">{data.taxEfficiencyScore.explanation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#6B7876] uppercase tracking-wider print:text-[#42504F]">Why It Matters</h4>
                <p className="text-[#42504F] print:text-[#0B2E33] leading-relaxed">{data.taxEfficiencyScore.whyItMatters}</p>
              </div>
              
              {data.taxEfficiencyScore.breakdown && Object.keys(data.taxEfficiencyScore.breakdown).length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#E8E2D2] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(data.taxEfficiencyScore.breakdown).map(([key, details]) => (
                    <div key={key} className="bg-white p-4 rounded border border-[#E8E2D2] print:border-[#E8E2D2]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-[#42504F] print:text-[#0B2E33]">{key}</span>
                        <span className="text-[#B8873D] font-bold">{details.score}/100</span>
                      </div>
                      <p className="text-xs text-[#6B7876] print:text-[#42504F] leading-relaxed">{details.insight}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </BlueprintSection>

        <BlueprintSection title="Regime Comparison" subtitle="Old vs New Tax Regime Analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:break-inside-avoid">
            <div className={`p-6 border rounded-xl flex flex-col h-full ${data.recommendedRegime === 'old' ? 'border-[#D9B978] bg-[#F6F3EC]/60 print:bg-white print:border-[#0F3A3F]' : 'border-[#E8E2D2] bg-[#F6F3EC] print:bg-white'}`}>
              <div className="flex justify-between items-center mb-6 border-b border-[#E8E2D2] pb-4">
                <h4 className="font-bold text-xl text-[#0B2E33] print:text-black">Old Regime</h4>
                {data.recommendedRegime === 'old' && <span className="px-3 py-1 bg-[#0B2E33] text-white text-xs font-bold rounded-full print:border print:border-[#0F3A3F] print:text-[#0B2E33] print:bg-white">Recommended</span>}
              </div>
              <div className="space-y-4 text-sm mb-6 flex-1">
                <div className="flex justify-between">
                  <span className="text-[#42504F] print:text-[#0B2E33]">Gross Income</span>
                  <span className="font-medium">₹{data.regimeComparison.grossIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#42504F] print:text-[#0B2E33]">Total Deductions</span>
                  <span className="font-medium text-emerald-600">-₹{data.regimeComparison.totalDeductionsOld.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-[#0B2E33] print:text-black">Taxable Income</span>
                  <span>₹{data.regimeComparison.taxableIncomeOld.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-4 mt-2 border-t border-[#E8E2D2]">
                  <span className="text-[#0B2E33] font-bold print:text-black text-lg">Estimated Tax</span>
                  <span className="font-bold text-xl text-rose-600">₹{data.regimeComparison.taxCalculatedOld.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#E8E2D2] text-sm space-y-4 print:border-[#D9D2C3]">
                <div>
                  <h5 className="font-semibold text-emerald-700 mb-2">Key Advantages</h5>
                  <ul className="list-disc pl-4 space-y-1 text-[#42504F]">
                    {data.regimeComparison.oldRegimeAdvantages?.map((adv, i) => <li key={i}>{adv}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-rose-700 mb-2">Key Limitations</h5>
                  <ul className="list-disc pl-4 space-y-1 text-[#42504F]">
                    {data.regimeComparison.oldRegimeLimitations?.map((lim, i) => <li key={i}>{lim}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className={`p-6 border rounded-xl flex flex-col h-full ${data.recommendedRegime === 'new' ? 'border-[#D9B978] bg-[#F6F3EC]/60 print:bg-white print:border-[#0F3A3F]' : 'border-[#E8E2D2] bg-[#F6F3EC] print:bg-white'}`}>
              <div className="flex justify-between items-center mb-6 border-b border-[#E8E2D2] pb-4">
                <h4 className="font-bold text-xl text-[#0B2E33] print:text-black">New Regime</h4>
                {data.recommendedRegime === 'new' && <span className="px-3 py-1 bg-[#0B2E33] text-white text-xs font-bold rounded-full print:border print:border-[#0F3A3F] print:text-[#0B2E33] print:bg-white">Recommended</span>}
              </div>
              <div className="space-y-4 text-sm mb-6 flex-1">
                <div className="flex justify-between">
                  <span className="text-[#42504F] print:text-[#0B2E33]">Gross Income</span>
                  <span className="font-medium">₹{data.regimeComparison.grossIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#42504F] print:text-[#0B2E33]">Total Deductions</span>
                  <span className="font-medium text-emerald-600">-₹{data.regimeComparison.totalDeductionsNew.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-[#0B2E33] print:text-black">Taxable Income</span>
                  <span>₹{data.regimeComparison.taxableIncomeNew.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-4 mt-2 border-t border-[#E8E2D2]">
                  <span className="text-[#0B2E33] font-bold print:text-black text-lg">Estimated Tax</span>
                  <span className="font-bold text-xl text-rose-600">₹{data.regimeComparison.taxCalculatedNew.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#E8E2D2] text-sm space-y-4 print:border-[#D9D2C3]">
                <div>
                  <h5 className="font-semibold text-emerald-700 mb-2">Key Advantages</h5>
                  <ul className="list-disc pl-4 space-y-1 text-[#42504F]">
                    {data.regimeComparison.newRegimeAdvantages?.map((adv, i) => <li key={i}>{adv}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-rose-700 mb-2">Key Limitations</h5>
                  <ul className="list-disc pl-4 space-y-1 text-[#42504F]">
                    {data.regimeComparison.newRegimeLimitations?.map((lim, i) => <li key={i}>{lim}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0B2E33] rounded-xl p-6 text-white print:bg-white print:border-2 print:border-black print:text-black print:break-inside-avoid">
            <h4 className="text-sm uppercase tracking-widest text-[#839F9D] font-bold mb-2 print:text-[#42504F]">Strategic Recommendation</h4>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold">{data.recommendedRegime === 'old' ? 'Old Regime' : 'New Regime'}</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-semibold rounded text-sm print:bg-emerald-100 print:text-emerald-800">
                Save ₹{data.regimeComparison.potentialSavings.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[#D9B978] leading-relaxed print:text-[#0B2E33]">{data.regimeComparison.reasoning}</p>
          </div>
        </BlueprintSection>

        {data.deductions.length > 0 && (
          <BlueprintSection title="Deduction Utilisation" subtitle="Track how effectively you are using available tax limits">
            <div className="space-y-6 print:break-inside-avoid">
              {data.deductions.map((deduction, i) => {
                const percent = Math.min(100, Math.max(0, (deduction.utilised / deduction.limit) * 100));
                return (
                  <div key={i} className="p-5 border border-[#E8E2D2] rounded-lg print:border-[#D9D2C3]">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-[#0B2E33] print:text-black">{deduction.name} ({deduction.section})</h4>
                        <p className="text-xs text-[#6B7876] print:text-[#42504F] mt-1">{deduction.suggestion}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#0B2E33] print:text-black">₹{deduction.utilised.toLocaleString('en-IN')} <span className="text-[#839F9D] font-normal">/ ₹{deduction.limit.toLocaleString('en-IN')}</span></p>
                        <p className="text-xs text-[#B8873D] font-medium mt-1">₹{deduction.remaining.toLocaleString('en-IN')} Remaining</p>
                      </div>
                    </div>
                    <div className="w-full bg-[#EFEAE0] rounded-full h-2.5 print:border print:border-[#E8E2D2] overflow-hidden">
                      <div className="bg-[#0B2E33] h-2.5 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </BlueprintSection>
        )}

        {data.missedOpportunities.length > 0 && (
          <BlueprintSection title="Missed Tax Saving Opportunities">
            <div className="grid grid-cols-1 gap-6 print:break-inside-avoid">
              {data.missedOpportunities.map((opp, i) => (
                <div key={i} className="p-6 bg-white border border-[#E8E2D2] rounded-xl shadow-sm print:border-[#D9D2C3] print:shadow-none flex flex-col md:flex-row gap-6">
                   <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-[#E8E2D2] pb-4 md:pb-0 md:pr-6 print:border-[#E8E2D2]">
                      <h4 className="font-bold text-lg text-[#0B2E33] mb-2 print:text-black">{opp.opportunity}</h4>
                      <p className="text-sm text-[#6B7876] mb-4 print:text-[#42504F] italic">"{opp.currentSituation}"</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#6B7876]">Estimated Benefit</span>
                          <span className="font-bold text-emerald-600">{opp.estimatedTaxBenefit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#6B7876]">Priority</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${opp.priority.toLowerCase() === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-[#EFEAE0] text-[#42504F]'}`}>{opp.priority}</span>
                        </div>
                         <div className="flex items-center justify-between">
                          <span className="text-sm text-[#6B7876]">Effort Required</span>
                          <span className="text-sm font-medium text-[#42504F]">{opp.effortRequired}</span>
                        </div>
                      </div>
                   </div>
                   <div className="md:w-2/3 flex flex-col justify-center space-y-4">
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-[#839F9D] mb-1">Recommended Action</h5>
                        <p className="text-[#42504F] leading-relaxed print:text-black">{opp.recommendedAction}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-[#839F9D] mb-1">Expected Outcome</h5>
                        <p className="text-[#42504F] leading-relaxed print:text-black">{opp.expectedOutcome}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </BlueprintSection>
        )}

        <BlueprintSection title="Tax Optimisation Roadmap" subtitle="Actionable steps to minimize your tax burden">
          <RoadmapTimeline steps={
            data.roadmap?.map(step => ({
              timeframe: step.timeframe,
              action: `[${step.priority}] ${step.action}`,
              impact: `Reasoning: ${step.reasoning} → Benefit: ${step.expectedBenefit} (Estimated Impact: ${step.estimatedTaxImpact})`
            })) || []
          } />
        </BlueprintSection>

        <BlueprintSection title="Annual Tax Planning Calendar" subtitle="Proactive strategies across the financial year">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
              {data.annualTaxCalendar?.map((quarter, i) => (
                <div key={i} className="bg-[#F6F3EC] border border-[#E8E2D2] rounded-xl p-6 print:bg-white print:border-[#D9D2C3]">
                  <div className="border-b border-[#E8E2D2] pb-3 mb-4 print:border-[#D9D2C3]">
                    <h4 className="font-bold text-lg text-[#0B2E33] print:text-black">{quarter.quarter}</h4>
                    <p className="text-sm text-[#B8873D] font-medium">{quarter.focus}</p>
                  </div>
                  <ul className="space-y-3">
                    {quarter.actionItems.map((item, j) => (
                      <li key={j} className="flex gap-3 items-start">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D9B978] shrink-0"></span>
                        <span className="text-sm text-[#42504F] print:text-[#0B2E33]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
           </div>
        </BlueprintSection>
        
        <BlueprintSection title="Risk & Compliance Notes">
          <ul className="list-disc pl-5 space-y-2 text-[#42504F] print:text-black">
            {data.taxRiskAndComplianceNotes?.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </BlueprintSection>

        <hr className="border-t border-[#E8E2D2] print:border-[#D9D2C3] my-10" />

        <BlueprintSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 print:block">
            <div className="lg:col-span-7 print:mb-12 print:break-inside-avoid">
              <EducationBlock 
                title={data.educationalNotes?.title || 'Tax Concepts'}
                content={data.educationalNotes?.content || ''}
              />
              <div className="mt-8 pt-8 border-t border-[#E8E2D2] print:border-[#D9D2C3] print:break-inside-avoid">
                <h4 className="font-semibold text-sm uppercase tracking-widest text-[#839F9D] mb-4 print:text-[#42504F]">Analysis Assumptions</h4>
                <ul className="text-xs text-[#6B7876] space-y-2 list-disc pl-5 print:text-[#42504F]">
                  {data.assumptionsAndDisclaimer?.map((assumption, i) => (
                    <li key={i}>{assumption}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-5 print:break-inside-avoid">
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
