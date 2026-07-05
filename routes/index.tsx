import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase,
  ChevronRight,
  Compass,
  FileText,
  GraduationCap,
  Home,
  User,
  Users,
} from "lucide-react";
import { useGame } from "../hooks/useGame";
import { StartScreen } from "../components/game/StartScreen";
import { GameHeader } from "../components/game/GameHeader";
import { StatBars } from "../components/game/StatBars";
import { ActionTabs } from "../components/game/ActionTabs";
import { LifeTimeline } from "../components/game/LifeTimeline";
import { NetWorthChart } from "../components/game/NetWorthChart";
import { EventModal } from "../components/game/EventModal";
import { ResultModal } from "../components/game/ResultModal";
import { CourseSelectionModal } from "../components/game/CourseSelectionModal";
import { SchoolSelectionModal } from "../components/game/SchoolSelectionModal";
import { IBExamModal } from "../components/game/IBExamModal";
import { ResumePage } from "../components/game/ResumePage";
import { InternshipsPage } from "../components/game/InternshipsPage";
import { DeathScreen } from "../components/game/DeathScreen";
import { EducationDashboard } from "../components/game/EducationDashboard";
import { ProfilePage } from "../components/game/ProfilePage";
import { CareersPage } from "../components/game/CareersPage";
import { PeoplePage } from "../components/game/PeoplePage";
import { CompetitionModal } from "../components/game/CompetitionModal";

export const Route = createFileRoute("/")({
  component: Index,
});

type View = "life" | "education" | "careers" | "internships" | "people" | "resume" | "profile";

const NAV: { id: View; label: string; icon: typeof Home }[] = [
  { id: "life", label: "Life", icon: Home },
  { id: "education", label: "School", icon: GraduationCap },
  { id: "careers", label: "Careers", icon: Compass },
  { id: "internships", label: "Interns", icon: Briefcase },
  { id: "people", label: "People", icon: Users },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

function Index() {
  const game = useGame();
  const [view, setView] = useState<View>("life");
  const [ibExamOpen, setIbExamOpen] = useState(false);

  if (!game.loaded) {
    return <div className="min-h-screen" />;
  }

  if (!game.character) {
    return <StartScreen onStart={game.start} />;
  }

  if (!game.character.alive) {
    return <DeathScreen character={game.character} onRestart={game.restart} />;
  }

  const c = game.character;

  return (
    <div className="mx-auto max-w-5xl px-3 py-3 sm:px-4">
      <GameHeader character={c} onRestart={game.restart} />

      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto rounded-2xl bg-white/5 p-1">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = view === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition sm:flex-1 ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {n.label}
            </button>
          );
        })}
      </div>

      {view === "life" && (
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <StatBars stats={c.stats} />
            <NetWorthChart character={c} />
            <ActionTabs
              character={c}
              onActivity={game.activity}
              onApply={game.apply}
              onResign={game.resign}
              onEnroll={game.enroll}
              onFafsa={game.fafsa}
              onAppeal={game.appeal}
              onApplyGrad={game.applyGrad}
              onAcceptOffer={game.acceptOffer}
            />
            <button
              onClick={game.advance}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-base font-bold text-primary-foreground transition hover:brightness-105 active:scale-[0.99]"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              Age Up <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="h-[400px] lg:h-auto">
            <LifeTimeline character={c} />
          </div>
        </div>
      )}

      {view === "education" && (
        <div className="mt-3">
          <EducationDashboard
            character={c}
            onExam={game.exam}
            onJoin={game.joinActivity}
            onAssignments={game.assignments}
            onWorkStudy={game.workStudy}
            onSitIBExams={() => setIbExamOpen(true)}
          />
        </div>
      )}

      {view === "internships" && (
        <div className="mt-3">
          <InternshipsPage character={c} onApply={game.applyIntern} />
        </div>
      )}

      {view === "careers" && (
        <div className="mt-3">
          <CareersPage character={c} onApply={game.apply} />
        </div>
      )}

      {view === "people" && (
        <div className="mt-3">
          <PeoplePage
            character={c}
            onParentAction={game.parentAction}
            onAskOut={game.datingAskOut}
            onPartnerTime={game.partnerTime}
            onProgress={game.partnerProgress}
            onBreakUp={game.partnerBreakUp}
            onHaveBaby={game.tryBaby}
            onChildAction={game.childAction}
          />
        </div>
      )}

      {view === "resume" && (
        <div className="mt-3">
          <ResumePage character={c} />
        </div>
      )}

      {view === "profile" && (
        <div className="mt-3">
          <ProfilePage character={c} />
        </div>
      )}

      <EventModal event={game.pendingEvent} onChoose={game.chooseEvent} />

      {/* Yearly club & sport competitions (one per activity) */}
      {!game.pendingEvent && !c.pendingSchoolChoice && (
        <CompetitionModal
          ticket={c.pendingCompetitions?.[0] ?? null}
          onComplete={game.finishCompetition}
          onSkip={game.passCompetition}
        />
      )}

      {/* School selection at each stage entry (elementary / middle / high) */}
      {!game.pendingEvent && (
        <SchoolSelectionModal
          character={c}
          onApply={game.applySchool}
          onEnroll={game.enrollSchool}
          onDeclineOffer={game.declineSchool}
          onStayPublic={game.stayPublic}
        />
      )}

      {/* Grade 12 IB examinations */}
      <IBExamModal
        character={c}
        open={ibExamOpen && !!c.edu.needsIBExams}
        onComplete={(ratios) => {
          setIbExamOpen(false);
          game.finishIBExams(ratios);
        }}
        onCancel={() => setIbExamOpen(false)}
      />

      {/* IB course selection — blocks play until 3 HL + 3 SL are chosen */}
      <CourseSelectionModal
        open={!game.pendingEvent && !!c.edu.needsCourseSelection && c.education === "high"}
        onConfirm={game.chooseCourses}
      />

      {/* Action results appear as a popup, like life events */}
      <ResultModal result={game.result} onDismiss={game.dismissResult} />
    </div>
  );
}
