import { motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Clock3,
  Tag,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { StatusBadge } from "@/components/common";
import { hoverCard } from "@/lib/animations";
import { formatDate } from "@/lib/formatters";
import { EditQuestionDialog, DeleteQuestionDialog } from "..";

const QuestionCard = ({ question }) => {
  return (
    <motion.div
      {...hoverCard}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <Card className="h-full border transition-all duration-300 hover:border-primary/30 hover:shadow-2xl">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="line-clamp-2 text-lg font-semibold">
              {question.question}
            </h3>

            <StatusBadge status={question.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>{question.category}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span>{question.type}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              <span>{question.difficulty}</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Used in {question.usedIn} assessments
          </div>

          <div className="text-xs text-muted-foreground">
            Last updated • {formatDate(question.updatedAt)}
          </div>
        </CardContent>

        <CardFooter className="gap-2 flex-wrap">
          <motion.div whileHover={{ scale: 1.05 }} className="flex-1 min-w-[70px]">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </motion.div>

          <EditQuestionDialog question={question} />
          
          <DeleteQuestionDialog question={question} />
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
