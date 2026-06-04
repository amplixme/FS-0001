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

function AdminPage() {
  const [loading, setLoading] = useState(true);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        Cargando panel...
      </div>
    );
  }

  const handleChangeUserRole = async (id) => {
    try {
      await changeUserRole(id);
      await loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      await loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      await loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id);
      await loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Panel de Administración
        </h1>

        <p className="text-muted-foreground">
          Gestión general del blog
        </p>
      </div>

      {/* STATS */}

      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-sm text-muted-foreground">
              Usuarios
            </h3>

            <p className="mt-2 text-4xl font-bold">
              {stats.totalUsers}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm text-muted-foreground">
              Posts
            </h3>

            <p className="mt-2 text-4xl font-bold">
              {stats.totalPosts}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm text-muted-foreground">
              Comentarios
            </h3>

            <p className="mt-2 text-4xl font-bold">
              {stats.totalComments}
            </p>
          </Card>
        </div>
      )}

      {/* USUARIOS */}

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Usuarios
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
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b"
                >
                  <td className="p-3">{user.name}</td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3">
                    {user.role}
                  </td>

                  <td className="p-3">
                    {user.postsCount}
                  </td>

                  <td className="p-3">
                    {new Date(
                      user.createdAt,
                    ).toLocaleDateString()}
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
                            Editar
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
                            Eliminar
                          </Button>
                        }
                        title="Eliminar usuario"
                        description={`¿Seguro que deseas eliminar a ${user.name}?`}
                        onConfirm={() => handleDeleteUser(user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* POSTS */}

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Posts recientes
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
              {posts.map((post) => (
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
                    {new Date(
                      post.createdAt,
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-end">
                      <ConfirmModal
                        trigger={
                          <Button
                            size="sm"
                            variant="destructive"
                          >
                            Eliminar
                          </Button>
                        }
                        title="Eliminar post"
                        description={`¿Seguro que deseas eliminar el post ${post.title}?`}
                        onConfirm={() => handleDeletePost(post.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
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
          {comments.map((comment) => (
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
                    Eliminar
                  </Button>
                }
                title="Eliminar comentario"
                description={`¿Seguro que deseas eliminar el comentario de ${comment.author?.name}?`}
                onConfirm={() => handleDeleteComment(comment.id)}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default AdminPage;