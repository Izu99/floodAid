 'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/LanguageContext';

interface FeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [thoughts, setThoughts] = useState('');
    const [improvements, setImprovements] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name || 'Anonymous',
                    thoughts,
                    improvements
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            // Show success message
            alert(t('feedback.successMessage'));

            // Reset form and close dialog
            setName('');
            setThoughts('');
            setImprovements('');
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert(t('feedback.errorMessage') || 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('feedback.title')}</DialogTitle>
                    <DialogDescription>
                        {t('feedback.description')}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('feedback.nameLabel')}</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('feedback.namePlaceholder')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thoughts">{t('feedback.thoughtsLabel')}</Label>
                        <Textarea
                            id="thoughts"
                            value={thoughts}
                            onChange={(e) => setThoughts(e.target.value)}
                            placeholder={t('feedback.thoughtsPlaceholder')}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="improvements">{t('feedback.improvementsLabel')}</Label>
                        <Textarea
                            id="improvements"
                            value={improvements}
                            onChange={(e) => setImprovements(e.target.value)}
                            placeholder={t('feedback.improvementsPlaceholder')}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {t('feedback.submitButton')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
