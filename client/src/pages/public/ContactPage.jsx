import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/common/Input.jsx';
import { Textarea } from '../../components/common/Textarea.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please provide a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters long'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    // Simulate editorial dispatch
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Your message has been received by our editorial team.');
      reset();
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-900 border border-emperor-500/40 text-emperor-400 text-xs font-semibold font-mono shadow-[0_0_20px_rgba(245,184,0,0.15)] animate-pulse">
          <MessageSquare className="w-3.5 h-3.5 text-emperor-500" />
          <span>Editorial Communications</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-emperor-400 via-amber-300 to-yellow-200">Editorial Desk</span>
        </h1>
        <p className="text-sm text-obsidian-400 leading-relaxed font-tech">
          Submit publication inquiries, contribute guest articles, or report technical issues directly to the ContentFlow administrative team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Info Card */}
        <div className="group md:col-span-5 p-8 rounded-3xl bg-obsidian-900 border border-obsidian-800 space-y-6 flex flex-col justify-between shadow-surface-card transition-all duration-300 hover:border-emperor-500/30 hover:shadow-[0_15px_35px_rgba(245,184,0,0.1)]">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emperor-300 transition-colors">
              Direct Communication
            </h3>
            <p className="text-xs text-obsidian-400 leading-relaxed">
              We welcome submissions from architects, developers, and product engineers.
            </p>

            <div className="pt-4 space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 flex items-center gap-3 text-obsidian-300 hover:border-emperor-500/40 hover:bg-obsidian-800 transition-all duration-300">
                <Mail className="w-4 h-4 text-emperor-400 shrink-0 animate-bounce" />
                <span>editorial@contentflow.com</span>
              </div>
              <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 flex items-center gap-3 text-obsidian-300 hover:border-jade-500/40 hover:bg-obsidian-800 transition-all duration-300">
                <MessageSquare className="w-4 h-4 text-jade-400 shrink-0" />
                <span>Response Window: 24-48 Hours</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-jade-950/40 border border-jade-600/30 text-xs text-jade-300 flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-jade-400 animate-pulse" />
            <span>Editorial submissions are reviewed by platform staff.</span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-obsidian-900 border border-obsidian-800 rounded-3xl p-8 shadow-surface-card hover:border-obsidian-700 transition-all duration-300">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-jade-950 border border-jade-600/50 flex items-center justify-center text-jade-400 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Delivered</h3>
              <p className="text-xs text-obsidian-400 max-w-sm mx-auto">
                Thank you for reaching out. Your inquiry has been forwarded to the editorial desk.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSubmitted(false)}
              >
                Send Another Note
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="e.g. Alex Rivera"
                  required
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="alex@domain.com"
                  required
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <Input
                label="Topic Subject"
                placeholder="e.g. Guest article proposal on Kubernetes"
                required
                error={errors.subject?.message}
                {...register('subject')}
              />

              <Textarea
                label="Message Details"
                rows={5}
                placeholder="Provide complete context or questions regarding the platform..."
                required
                error={errors.message?.message}
                {...register('message')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                className="w-full"
                icon={Send}
              >
                Submit Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

