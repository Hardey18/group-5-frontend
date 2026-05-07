'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useUser } from '@/hooks/use-user';
import { M } from '@/config/mtn-tokens';

export function AccountInfo(): React.JSX.Element {
  const { user } = useUser();
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user?.userName === 'admin1' ? process.env.NEXT_PUBLIC_AVATAR_URL : user?.userName === 'cus1' ? process.env.NEXT_PUBLIC_AVATAR_URL_CUSTOMER : process.env.NEXT_PUBLIC_AVATAR_URL_OTHERS} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.name}</Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" style={{color: `${M.yellowDark}`}}>
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
