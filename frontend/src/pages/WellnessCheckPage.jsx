import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight, BedDouble, Check, Languages, User } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import InputField from "../components/InputField";
import RadioGroup from "../components/RadioGroup";
import LoadingSpinner from "../components/LoadingSpinner";
import { useWellness } from "../context/WellnessContext";
import { predictWellness } from "../api/wellmindApi";
import { analyzeWellness, buildRecommendations } from "../utils/wellnessEngine";
import { OCCUPATION_OPTIONS } from "../utils/formMappings";
import { LANGS, loadRecLang, saveRecLang } from "../utils/recommendationI18n";
import { getCheckCopy } from "../utils/wellnessCheckI18n";

const initialForm = {
  age: "",
  gender: "",
  occupation: "",
  sleepDuration: "",
  sleepQuality: "",
  sleepDisorder: "No",
  physicalActivityLevel: "Moderate",
  dailySteps: "",
  stressLevel: "Medium",
  bmiCategory: "Normal",
};

function sectionDone(form, key) {
  if (key === "personal") return Boolean(form.age && form.gender && form.occupation);
  if (key === "sleep") return Boolean(form.sleepDuration && form.sleepQuality && form.sleepDisorder);
  if (key === "lifestyle") {
    return Boolean(form.physicalActivityLevel && form.dailySteps && form.stressLevel);
  }
  return false;
}

export default function WellnessCheckPage() {
  const navigate = useNavigate();
  const { saveResult, setLoading, loading, updateProfile } = useWellness();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [lang, setLang] = useState(loadRecLang);
  const t = getCheckCopy(lang);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onLangChange = (next) => {
    setLang(next);
    saveRecLang(next);
  };

  const validate = () => {
    const next = {};
    if (!form.age || Number(form.age) < 1) next.age = t.errAge;
    if (!form.gender) next.gender = t.errGender;
    if (!form.occupation) next.occupation = t.errOccupation;
    if (!form.sleepDuration) next.sleepDuration = t.errSleep;
    if (!form.sleepQuality) next.sleepQuality = t.errQuality;
    if (!form.stressLevel) next.stressLevel = t.errStress;
    if (!form.physicalActivityLevel) next.physicalActivityLevel = t.errActivity;
    if (!form.dailySteps) next.dailySteps = t.errSteps;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    updateProfile({
      age: form.age,
      gender: form.gender,
      occupation: form.occupation,
    });

    try {
      const result = await predictWellness(form);
      saveResult(result, buildRecommendations({ ...result, form }));
      navigate("/dashboard");
    } catch (err) {
      console.warn("API unavailable, using local engine:", err);
      setApiError(t.apiOffline);
      const result = analyzeWellness(form);
      const recommendations = buildRecommendations(result);
      saveResult(result, recommendations);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const occupationOptions = OCCUPATION_OPTIONS.map((opt) => ({
    ...opt,
    label: opt.value === "" ? t.selectOccupation : opt.label,
  }));

  return (
    <DashboardLayout title={t.title} subtitle={t.subtitle}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={onSubmit} className="space-y-5 animate-fade-in pb-24 md:pb-8">
          <div className="flex justify-end">
            <label className="relative inline-flex shrink-0 items-center">
              <span className="sr-only">{t.language}</span>
              <Languages className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-brand" aria-hidden />
              <select
                value={lang}
                onChange={(e) => onLangChange(e.target.value)}
                className="appearance-none rounded-xl border border-[var(--border)] bg-white/50 py-2 pl-8 pr-8 text-xs font-semibold outline-none transition hover:border-brand focus:border-brand focus:ring-2 focus:ring-brand/30 dark:bg-slate-900/50"
                aria-label={t.language}
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 text-[10px] text-[var(--text-muted)]" aria-hidden>
                ▾
              </span>
            </label>
          </div>

          {apiError && (
            <p className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
              {apiError}
            </p>
          )}

          <Section
            id="check-personal"
            title={t.personalTitle}
            icon={User}
            tone="from-brand/20 to-ai/10"
            done={sectionDone(form, "personal")}
            doneLabel={t.complete}
            progressLabel={t.inProgress}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <InputField
                label={t.age}
                name="age"
                type="number"
                value={form.age}
                onChange={onChange}
                error={errors.age}
                placeholder={t.agePh}
                min={1}
                max={120}
              />
              <InputField
                label={t.gender}
                name="gender"
                as="select"
                value={form.gender}
                onChange={onChange}
                error={errors.gender}
                options={[
                  { value: "", label: t.select },
                  { value: "Male", label: t.male },
                  { value: "Female", label: t.female },
                ]}
              />
              <InputField
                label={t.occupation}
                name="occupation"
                as="select"
                value={form.occupation}
                onChange={onChange}
                error={errors.occupation}
                options={occupationOptions}
              />
            </div>
          </Section>

          <Section
            id="check-sleep"
            title={t.sleepTitle}
            icon={BedDouble}
            tone="from-ai/20 to-brand/10"
            done={sectionDone(form, "sleep")}
            doneLabel={t.complete}
            progressLabel={t.inProgress}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label={t.sleepDuration}
                name="sleepDuration"
                type="number"
                step="0.1"
                value={form.sleepDuration}
                onChange={onChange}
                error={errors.sleepDuration}
                placeholder={t.sleepPh}
              />
              <InputField
                label={t.sleepQuality}
                name="sleepQuality"
                type="number"
                min={1}
                max={10}
                value={form.sleepQuality}
                onChange={onChange}
                error={errors.sleepQuality}
                placeholder={t.qualityPh}
              />
            </div>
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-white/30 p-4 dark:bg-slate-950/25">
              <RadioGroup
                label={t.sleepDisorder}
                name="sleepDisorder"
                value={form.sleepDisorder}
                onChange={onChange}
                options={[
                  { value: "No", label: t.no },
                  { value: "Insomnia", label: t.insomnia },
                  { value: "Sleep Apnea", label: t.sleepApnea },
                ]}
              />
            </div>
          </Section>

          <Section
            id="check-lifestyle"
            title={t.lifestyleTitle}
            icon={Activity}
            tone="from-emerald-500/15 to-brand/10"
            done={sectionDone(form, "lifestyle")}
            doneLabel={t.complete}
            progressLabel={t.inProgress}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label={t.activity}
                name="physicalActivityLevel"
                as="select"
                value={form.physicalActivityLevel}
                onChange={onChange}
                error={errors.physicalActivityLevel}
                options={[
                  { value: "Low", label: t.low },
                  { value: "Moderate", label: t.moderate },
                  { value: "High", label: t.high },
                ]}
              />
              <InputField
                label={t.dailySteps}
                name="dailySteps"
                type="number"
                value={form.dailySteps}
                onChange={onChange}
                error={errors.dailySteps}
                placeholder={t.stepsPh}
              />
              <InputField
                label={t.stress}
                name="stressLevel"
                as="select"
                value={form.stressLevel}
                onChange={onChange}
                error={errors.stressLevel}
                options={[
                  { value: "Low", label: t.low },
                  { value: "Medium", label: t.medium },
                  { value: "High", label: t.high },
                ]}
              />
              <InputField
                label={t.bodyType}
                name="bmiCategory"
                as="select"
                value={form.bmiCategory}
                onChange={onChange}
                options={[
                  { value: "Underweight", label: t.underweight },
                  { value: "Normal", label: t.normal },
                  { value: "Overweight", label: t.overweight },
                  { value: "Obese", label: t.obese },
                ]}
              />
            </div>
          </Section>

          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--bg-card)]/95 p-4 backdrop-blur-md md:static md:border-0 md:bg-transparent md:p-0">
            <div className="md:glass-card md:relative md:overflow-hidden md:p-4">
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-brand/10 to-ai/10 md:block" />
              <button type="submit" className="btn-primary relative w-full md:w-auto">
                {t.submit}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
}

function Section({ id, title, icon: Icon, done, tone, doneLabel, progressLabel, children }) {
  return (
    <section
      id={id}
      className="glass-card group relative scroll-mt-24 overflow-hidden p-5 shadow-sm transition hover:shadow-md md:p-6"
    >
      <div className={`pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-gradient-to-br ${tone} blur-2xl opacity-70`} />
      <div className="relative mb-5 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-ai/20 text-brand ring-1 ring-brand/25">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold md:text-lg">{title}</h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {done ? doneLabel : progressLabel}
            </p>
          </div>
        </div>
        {done ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-semibold text-brand ring-1 ring-brand/25">
            <Check className="h-3.5 w-3.5" />
            OK
          </span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-brand/50 animate-pulse-soft" />
        )}
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}
