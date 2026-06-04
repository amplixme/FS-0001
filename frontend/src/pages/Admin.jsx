import { useEffect, useState } from 'react';
import {
  changeUserRole,
  deleteComment,
  deletePost,
  deleteUser,
  getStats,
  getUsers,
} from '@/services/admin.service';
import api from '@/services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/common/ConfirmModal';
import CreateUserModal from '@/components/admin/CreateUserModal';
import EditUserModal from '@/components/admin/EditUserModal';
import { toast } from 'sonner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Spinner from '@/components/common/Spinner';
import {
  Users,
  FileText,
  MessageSquare,
  Trash2,
  Pencil,
} from 'lucide-react';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        statsResponse,
        usersResponse,
        postsResponse,
        commentsResponse,
      ] = await Promise.all([
        getStats(),
        getUsers(),
        api.get('/admin/posts'),
        api.get('/admin/comments'),
      ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setPosts(postsResponse.data.data);
      setComments(commentsResponse.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadData}
      />
    );
  }

  const handleChangeUserRole = async (id) => {
    try {
      await changeUserRole(id);
      toast.success('Rol modificado');
      await loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      toast.success('Usuario eliminado');
      await loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      toast.success('Post eliminado');
      await loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id);
      toast.success('Comentario eliminado');
      await loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Panel de Administración
        </h1>

        <p className="text-muted-foreground">
          Bienvenido de nuevo. Aquí tienes un resumen del estado de TuProyecto.
        </p>
      </div>

      {/* STATS */}

      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm text-muted-foreground">
                  Usuarios
                </h3>

                <p className="mt-2 text-4xl font-bold">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="h-6 w-6 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm text-muted-foreground">
                  Posts
                </h3>

                <p className="mt-2 text-4xl font-bold">
                  {stats.totalPosts}
                </p>
              </div>
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm text-muted-foreground">
                  Comentarios
                </h3>

                <p className="mt-2 text-4xl font-bold">
                  {stats.totalComments}
                </p>
              </div>
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </Card>
        </div>
      )}

      {/* USUARIOS */}

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center justify-between">
            Usuarios
            <span className={`inline-flex rounded-md ms-2 px-2 py-1 text-xs font-medium bg-muted text-primary`}>
              {stats.totalUsers}
            </span>
          </h2>

          <CreateUserModal
            onSuccess={loadData}
          />
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Rol</th>
                <th className="p-3 text-left">Posts</th>
                <th className="p-3 text-left">Registro</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-gray-500"
                  >
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b"
                  >
                    <td className="p-3">{user.name}</td>

                    <td className="p-3">
                      {user.email}
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-3">
                      {user.postsCount}
                    </td>

                    <td className="p-3">
                      {formatRelativeTime(user.createdAt)}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <EditUserModal
                          user={user}
                          onSuccess={loadData}
                          trigger={
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <ConfirmModal
                          trigger={
                            <Button
                              size="sm"
                              variant="secondary"
                            >
                              Cambiar rol
                            </Button>
                          }
                          title="Modificar rol"
                          description={`¿Seguro que deseas modificar el rol de ${user.name}?`}
                          confirmText="Cambiar"
                          onConfirm={() => handleChangeUserRole(user.id)}
                        />

                        <ConfirmModal
                          trigger={
                            <Button
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Eliminar usuario"
                          description={`¿Seguro que deseas eliminar a ${user.name}?`}
                          onConfirm={() => handleDeleteUser(user.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* POSTS */}

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Publicaciones recientes
        </h2>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">
                  Título
                </th>

                <th className="p-3 text-left">
                  Autor
                </th>

                <th className="p-3 text-left">
                  Categorías
                </th>

                <th className="p-3 text-left">
                  Fecha
                </th>

                <th className="p-3 text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-500"
                  >
                    No hay posts disponibles
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {post.title}
                    </td>

                    <td className="p-3">
                      {post.author?.name}
                    </td>

                    <td className="p-3">
                      {post.categories
                        ?.map((c) => c.name)
                        .join(', ')}
                    </td>

                    <td className="p-3">
                      {formatRelativeTime(post.createdAt)}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-end">
                        <ConfirmModal
                          trigger={
                            <Button
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Eliminar post"
                          description={`¿Seguro que deseas eliminar el post ${post.title}?`}
                          onConfirm={() => handleDeletePost(post.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* COMENTARIOS */}

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Comentarios recientes
        </h2>

        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No hay comentarios para mostrar
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {comment.author?.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                </div>

                <ConfirmModal
                  trigger={
                    <Button
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                  title="Eliminar comentario"
                  description={`¿Seguro que deseas eliminar el comentario de ${comment.author?.name}?`}
                  onConfirm={() => handleDeleteComment(comment.id)}
                />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

export default AdminPage;