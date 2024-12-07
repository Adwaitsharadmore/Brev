import { useRouter } from "next/navigation";
import ShimmerButton from "@/components/ui/shimmer-button";

export function ShimmerButtonDemo() {
  const router = useRouter();
  
  const handleStartBreving = () => {
    router.push("/responsePage");
  };

  return (
    <div className="z-10 flex items-center justify-center">
      <ShimmerButton className="shadow-2xl" onClick={handleStartBreving} >
        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
          Start Breving
        </span>
      </ShimmerButton>
    </div>
  );
}
