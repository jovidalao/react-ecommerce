import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
      <Button variant="elevated">Button</Button>
      </div>
      <div>
      <Input placeholder="Input" />
      </div>
      <div>
      <Progress value={50} />
      </div>
      <div>
        <Textarea placeholder="Textarea" />
      </div>
    </div>
  );
}
