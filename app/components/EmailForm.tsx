"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToWaitingList } from "../actions/waitingList";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import getNameFromEmailadress from "@/lib/getNameFromEmailadress";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export function EmailForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const result = await addToWaitingList(values.email);

    if (result.success) {
      toast({
        title: `Danke ${getNameFromEmailadress(result.data.email_address)} 🎉`,
        description: "Du bist nun auf der Wahrteliste und hörst bald von mir ",
        variant: "success",
      });
    } else {
      toast({
        title: "Uuups etwas hat nicht geklappt 😥",
        description: result.message || "Something went wrong!",
        variant: "destructive",
      });
    }
    setIsLoading(false);
    form.reset();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 mb-16">
        <div className="flex gap-2 mt-4 justify-center">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input required {...field} />
                </FormControl>
                <FormDescription>
                  Deine Email mit welcher du dich nach Start der Arbeit in
                  dieser Applikation einloggen kannst.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isLoading ? (
            <Button type="submit">Register 🚀</Button>
          ) : (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Processing
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
