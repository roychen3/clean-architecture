import { generatePath, useNavigate } from 'react-router';
import { Ellipsis } from 'lucide-react';
import { toast } from 'sonner';

import { routerPathConfig } from '@/consts/routerPaths';

import { useDeleteArticle } from '@/hooks/articles/use-delete-article';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface ArticleOptionsProps {
  articleId: string;
  onDeleteSuccess?: () => void;
}
export const ArticleOptions = ({
  articleId,
  onDeleteSuccess,
}: ArticleOptionsProps) => {
  const navigate = useNavigate();
  const { mutateAsync: deleteArticle } = useDeleteArticle();

  const handleEdit: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    navigate(
      generatePath(routerPathConfig.articlesEdit.pathname, {
        articleId,
      }),
    );
  };
  const handleDelete: React.MouseEventHandler<HTMLDivElement> = async (
    event,
  ) => {
    event.stopPropagation();
    try {
      await deleteArticle({
        path: {
          id: articleId,
        },
      });
      toast.success('The article has been deleted successfully');
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete the article',
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
