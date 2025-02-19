'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Avatar as UIAvatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

export default function Avatar({
    uid,
    url,
    size,
    onUpload,
}: {
    uid: string;
    url: string | null;
    size: number;
    onUpload: (url: string) => void;
}) {
    const supabase = createClient();
    const [uploading, setUploading] = useState(false);

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `avatar-${uid}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
            });

            if (uploadError) {
                throw uploadError;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from('avatars').getPublicUrl(fileName);

            onUpload(publicUrl);
        } catch (error) {
            alert('Error uploading avatar!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <UIAvatar className="h-24 w-24">
                <AvatarImage src={url || ''} alt="Avatar" />
                <AvatarFallback>...</AvatarFallback>
            </UIAvatar>
            <div>
                <input
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                />
                <Label
                    htmlFor="single"
                    className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md"
                >
                    {uploading ? 'Uploading...' : 'Change Avatar'}
                </Label>
            </div>
        </div>
    );
}
