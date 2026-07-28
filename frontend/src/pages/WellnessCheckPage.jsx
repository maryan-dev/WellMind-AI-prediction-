import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, BedDouble, User } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import InputField from "../components/InputField";
import RadioGroup from "../components/RadioGroup";
import LoadingSpinner from "../components/LoadingSpinner";
import { useWellness } from "../context/WellnessContext";
import { predictWellness } from "../api/wellmindApi";
import { analyzeWellness, buildRecommendations } from "../utils/wellnessEngine";
import { OCCUPATION_OPTIONS } from "../utils/formMappings";

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

export default function WellnessCheckPage() {
  const navigate = useNavigate();
  const { saveResult, setLoading, loading, updateProfile } = useWellness();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.age || Number(form.age) < 1) next.age = "Enter a valid age";
    if (!form.gender) next.gender = "Select gender";
    if (!form.occupation) next.occupation = "Select occupation";
    if (!form.sleepDuration) next.sleepDuration = "Sleep duration is required";
    if (!form.sleepQuality) next.sleepQuality = "Sleep quality is required";
    if (!form.stressLevel) next.stressLevel = "Select stress level";
    if (!form.physicalActivityLevel) next.physicalActivityLevel = "Select activity level";
    if (!form.dailySteps) next.dailySteps = "Daily steps are required";
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
      setApiError("Backend offline — showing local demo analysis.");
      const result = analyzeWellness(form);
      const recommendations = buildRecommendations(result);
      saveResult(result, recommendations);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Wellness Check"
      subtitle="Simple questions — our AI handles the rest"
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={onSubmit} className="space-y-5 animate-fade-in pb-24 md:pb-8">
          {apiError && (
            <p className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
              {apiError}
            </p>
          )}
          <Section title="Personal Information" icon={User}>
            <div className="grid gap-4 md:grid-cols-3">
              <InputField label="Age" name="age" type="number" value={form.age} onChange={onChange} error={errors.age} min={1} max={120} />
              <InputField
                label="Gender"
                name="gender"
                as="select"
                value={form.gender}
                onChange={onChange}
                error={errors.gender}
                options={[
                  { value: "", label: "Select..." },
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
              />
              <InputField
                label="Occupation"
                name="occupation"
                as="select"
                value={form.occupation}
                onChange={onChange}
                error={errors.occupation}
                options={OCCUPATION_OPTIONS}
              />
            </div>
          </Section>

          <Section title="Sleep Information" icon={BedDouble}>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="Sleep Duration (hours)" name="sleepDuration" type="number" step="0.1" value={form.sleepDuration} onChange={onChange} error={errors.sleepDuration} />
              <InputField label="Quality of Sleep (1-10)" name="sleepQuality" type="number" min={1} max={10} value={form.sleepQuality} onChange={onChange} error={errors.sleepQuality} />
            </div>
            <div className="mt-4">
              <RadioGroup
                label="Do you have any sleep disorder?"
                name="sleepDisorder"
                value={form.sleepDisorder}
                onChange={onChange}
                options={[
                  { value: "No", label: "No" },
                  { value: "Insomnia", label: "Insomnia" },
                  { value: "Sleep Apnea", label: "Sleep Apnea" },
                ]}
              />
            </div>
          </Section>

          <Section title="Lifestyle Information" icon={Activity}>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Physical Activity Level"
                name="physicalActivityLevel"
                as="select"
                value={form.physicalActivityLevel}
                onChange={onChange}
                error={errors.physicalActivityLevel}
                options={[
                  { value: "Low", label: "Low" },
                  { value: "Moderate", label: "Moderate" },
                  { value: "High", label: "High" },
                ]}
              />
              <InputField label="Daily Steps" name="dailySteps" type="number" value={form.dailySteps} onChange={onChange} error={errors.dailySteps} placeholder="e.g. 8000" />
              <InputField
                label="Stress Level"
                name="stressLevel"
                as="select"
                value={form.stressLevel}
                onChange={onChange}
                error={errors.stressLevel}
                options={[
                  { value: "Low", label: "Low" },
                  { value: "Medium", label: "Medium" },
                  { value: "High", label: "High" },
                ]}
              />
              <InputField
                label="Body type (optional)"
                name="bmiCategory"
                as="select"
                value={form.bmiCategory}
                onChange={onChange}
                options={[
                  { value: "Underweight", label: "Underweight" },
                  { value: "Normal", label: "Normal" },
                  { value: "Overweight", label: "Overweight" },
                  { value: "Obese", label: "Obese" },
                ]}
              />
            </div>
          </Section>

          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--bg-card)]/95 p-4 backdrop-blur-md md:static md:border-0 md:bg-transparent md:p-0">
            <button type="submit" className="btn-primary w-full md:w-auto">
              Analyze my wellness
            </button>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="glass-card p-5 md:p-6">
      <div className="mb-4 flex items-center gap-3 border-b border-[var(--border)] pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
          <Icon className="h-[18px] w-[18px] text-brand" />
        </div>
        <h2 className="text-base font-semibold md:text-lg">{title}</h2>
      </div>
      {children}
    </section>
  );
}
