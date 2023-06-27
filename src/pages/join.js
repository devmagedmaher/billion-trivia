import React from 'react'
import { useForm } from '@mantine/form';
import {
  Button,
  Stack,
} from '@mantine/core';
import Layout from '../components/layout';
import Input from '../components/input';
import { useNavigate } from 'react-router-dom';
import { IconArrowBarRight } from '@tabler/icons';

const JoinPage = () => {
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      kitchen: localStorage.getItem('room') || '',
      name: localStorage.getItem('name') || '',
    },
    validate: {
      kitchen: val => val === '' ? 'Please enter the kitchen code' : null, 
      name: val => val === '' 
        ? 'Please enter your name'
        : val?.length > 15
          ? 'You name is too long!'
          : null,
    }
  })
  const [loading, setLoading] = React.useState(false)

  const goToKitchen = () => {
    form.validate()
    if (form.isValid()) {
      const { name, kitchen } = form.values
      // store name in local storage
      localStorage.setItem('name', name)
      localStorage.setItem('room', kitchen)

      setLoading(true)
      // go to kitchen page
      navigate(`/r/${kitchen}`)
    }
  }

  return (
    <Layout>
      <Stack>
        <Input
          name="kitchen"
          label="Kitchen Code"
          value={form.values.kitchen}
          error={form.errors.kitchen}
          onChange={text => form.setFieldValue('kitchen', text)}
          onEnter={goToKitchen}
          disabled={loading}
          size="lg"
        />
        <Input
          name="name"
          label="Your name"
          value={form.values.name}
          error={form.errors.name}
          onChange={text => form.setFieldValue('name', text)}
          onEnter={goToKitchen}
          disabled={loading}
          size="lg"
        />

        <Button
          onClick={goToKitchen}
          variant="outline"
          size='md'
          rightIcon={<IconArrowBarRight />}
          disabled={loading}
          loading={loading}
        >Join</Button>
      </Stack>
    </Layout>
  )
}

export default JoinPage;