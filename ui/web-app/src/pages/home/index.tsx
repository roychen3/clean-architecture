import { useState } from 'react';
import { useNavigate } from 'react-router';

import { routerPathConfig } from '@/consts/routerPaths';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { Container } from '@/components/container';
import { TypographyH1 } from '@/components/typography';

const HomePage = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const navigate = useNavigate();

  return (
    <Container className="flex justify-center items-center">
      <Card className="border-none w-full max-w-xl">
        <CardContent className="p-4 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <TypographyH1>CA Blog</TypographyH1>
            <p className="text-sm sm:text-base text-muted-foreground mb-0">
              Find articles about clean architecture and best practices
            </p>
          </div>

          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const searchParams = new URLSearchParams({
                title: searchTitle,
              });
              navigate({
                pathname: routerPathConfig.articles.pathname,
                search: '?' + searchParams.toString(),
              });
            }}
          >
            <Input
              placeholder="Search for articles..."
              className="flex-1"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <Button className="w-full sm:w-auto" type="submit">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HomePage;
