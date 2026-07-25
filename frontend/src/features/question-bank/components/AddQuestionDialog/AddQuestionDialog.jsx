"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AddQuestionDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Question
            </label>
            <Input
              placeholder="Enter question"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>
              <Input
                placeholder="JavaScript"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Difficulty
              </label>
              <Input
                placeholder="Easy"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Option A"
            />
            <Input
              placeholder="Option B"
            />
            <Input
              placeholder="Option C"
            />
            <Input
              placeholder="Option D"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={() => setOpen(false)}>
              Save Question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionDialog;
