import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Stack,
} from '@mantine/core'
import Layout from '../components/layout';

const NotFoundPage = () => {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  return (
    <Layout>
      <Stack>
        <div className='vertical-animation'>
          <div className='horizontal-animation'>
            Page not found
          </div>
        </div>
        <Button onClick={goHome}>
          Go Home
        </Button>
      </Stack>
    </Layout>
  );
}

export default NotFoundPage;