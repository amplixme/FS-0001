import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/user.service';

import ImageUpload from '@/components/common/ImageUpload';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function EditProfile() {
  const navigate = useNavigate();

  const {
    user,
    updateUser: updateAuthUser,
  } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || '',
  );

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const response = await updateProfile({
        name,
        bio,
        avatarUrl,
      });

      updateAuthUser({
        ...user,
        ...response.data,
      });

      toast.success('Perfil actualizado');

      navigate(`/profile/${user.id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">
            Editar perfil
          </h1>

          <p className="mb-6 text-sm text-muted-foreground">
            Personaliza tu identidad digital en la plataforma.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">
                Avatar
              </label>

              <ImageUpload
                value={avatarUrl}
                onChange={setAvatarUrl}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Nombre completo
              </label>

              <Input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Biografía
              </label>

              <textarea
                value={bio}
                maxLength={200}
                rows={5}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                className="w-full rounded-lg border p-3"
                placeholder="Breve descripción para tu perfil público"
              />

              <p className="mt-1 text-right text-xs text-muted-foreground">
                {bio.length}/200
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(`/profile/${user.id}`)
                }
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'Guardando...'
                  : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default EditProfile;