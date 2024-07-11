"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, SendHorizontal } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "sonner";

const ContactUsView = ({ className }: { className?: string }) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    try {
      const formData = new FormData(e.currentTarget);

      const data = {
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      };

      // Validate form data
      if (!data.fullName || !data.email || !data.subject || !data.message) {
        return toast.error("Please fill in all fields.");
      }

      if (!/\S+@\S+\.\S+/.test(data.email)) {
        return toast.error("Please enter a valid email address.");
      }

      const url = process.env.NEXT_PUBLIC_API_URL as string;
      const res = await fetch(`${url}/contact/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        return toast.error("Something went wrong, please try again.");
      }

      const result = await res.json();
      if (!result.success) {
        return toast.error("Something went wrong, please try again.");
      }

      toast.message("Success", {
        description:
          "Thank you for submitting your query. We got your message. Soon we will reach out to you.",
      });

      form.reset();
    } catch (error: any) {
      console.log(error.message);
      toast.error("An error occurred. Please try again. again!");
    }
  };

  return (
    <>
      <div
        className={`min-h-96 bg-green-100 flex justify-center flex-col gap-2 items-center bg-[url('/images/banner-10.png')] bg-cover bg-center ${
          className || ""
        }`}
      >
        <h4 className="text-slate-600 text-lg font-bold">
          How can we help you?
        </h4>
        <h2 className="text-5xl font-bold my-1">Let us know your problem</h2>
        <p className="text-slate-700 max-w-lg mx-auto text-center">
          You can share us about your problem by messaging us. We will try our
          best to provide you a smooth journey with Tienda.
        </p>
      </div>
      <div className="py-20 px-3 xl:px-0 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1">
            <h4 className="text-green-400 text-lg font-bold">Contact Form</h4>
            <h2 className="text-5xl font-bold my-5">Drop Us a Line</h2>
            <p className="text-slate-700 max-w-sm">
              Your email address will not be published. Fill all the information
              and press send button
            </p>
          </div>
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="name">Your fullname</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your fullname"
                  name="fullName"
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  name="email"
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  type="text"
                  id="subject"
                  placeholder="Subject"
                  name="subject"
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="message">Your message</Label>
                <Textarea
                  placeholder="Type your message here."
                  id="message"
                  name="message"
                />
              </div>

              <Button
                type="submit"
                className="bg-primaryMat text-white hover:bg-orange-400 py-[5px] group/submit overflow-hidden flex items-center justify-center gap-[5px]"
              >
                Send Message
                <span className="relative top-[-7px]">
                  <span className="absolute top-0 left-0">
                    <Mail
                      className="mr-2 h-4 w-4 top-0 group-hover/submit:top-[-50px] group-hover/submit:rotate-[-15deg] relative"
                      style={{ transition: "0.3s" }}
                    />
                  </span>

                  <span className="absolute top-0 left-0">
                    <SendHorizontal
                      className="mr-2 h-4 w-4 bottom-[-50px] group-hover/submit:bottom-[0px] relative"
                      style={{ transition: "0.3s" }}
                    />
                  </span>
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsView;
