import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { updateUser } from '@/services/admin.service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

function EditUserModal({
  user,
  trigger,
  onSuccess,
}) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'USER',
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateUser(user.id, formData);

      toast.success('Usuario actualizado');

      setOpen(false);

      onSuccess?.();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Editar usuario
          </DialogTitle>

          <DialogDescription>
            Modifica los datos del usuario.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
          />

          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-md border p-2"
          >
            <option value="USER">
              USER
            </option>

            <option value="ADMIN">
              ADMIN
            </option>
          </select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserModal;