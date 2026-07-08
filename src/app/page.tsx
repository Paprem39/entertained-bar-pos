import LoginLayout from "@/components/layout/LoginLayout";
import LoginCard from "@/components/login/LoginCard";

export default function Home() {
  return (
    <LoginLayout>
      <LoginCard>
        <h2 className="text-white">SYSTEM READY</h2>
      </LoginCard>
    </LoginLayout>
  );
}