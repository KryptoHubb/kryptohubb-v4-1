import { toast } from "sonner";

export function useDemoAction() {
  return (label: string) => {
    toast(`${label} is ready for your next move`, {
      description:
        "This front-end demo keeps the interaction local — no account or trade was created.",
      duration: 3200,
    });
  };
}
