'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useUserStore } from '@/providers/store-provider';
import { profileService } from '@/services/profile-service';

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
    const updateProfile = useUserStore((state) => state.updateProfile);

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];

            let deletePromise: Promise<void> = Promise.resolve();
            if (url) {
                const oldPath = url.split('?')[0];
                const pathParts = oldPath.split('avatars/')[1];
                if (pathParts) {
                    deletePromise = supabase.storage
                        .from('avatars')
                        .remove([pathParts])
                        .then(({ error }) => {
                            if (error) throw error;
                        });
                }
            }

            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop();
            const fileName = `${uid}/${timestamp}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);

            if (uploadError) throw uploadError;

            await deletePromise;

            const {
                data: { publicUrl },
            } = supabase.storage.from('avatars').getPublicUrl(fileName);

            const urlWithTimestamp = `${publicUrl}?t=${timestamp}`;
            onUpload(urlWithTimestamp);

            await profileService.updateProfile(uid, {
                avatar_url: urlWithTimestamp,
            });

            updateProfile({ avatar_url: urlWithTimestamp });
        } catch (error) {
            alert('Error uploading avatar!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {url ? (
                <Image
                    width={size}
                    height={size}
                    src={url}
                    alt="Avatar"
                    className="avatar image"
                    style={{ height: size, width: size }}
                />
            ) : (
                <div className="avatar no-image" style={{ height: size, width: size }} />
            )}
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
