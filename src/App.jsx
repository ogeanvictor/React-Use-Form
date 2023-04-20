import './styles/global.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const createUserFormSchema = z.object({
  email: z.string()
    .nonempty('O email é obrigatório')
    .email('Formato de email inválido'),
  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
})

function App() {
  const [output, setOutput] = useState('')
  const { register, handleSubmit, formState: {errors} }= useForm({
    resolver: zodResolver(createUserFormSchema),
  })
  
  function createUser(data) {
    setOutput(JSON.stringify(data,null,2))
  }
  return (
    <main className='h-screen bg-zinc-950 text-zin-50 flex flex-col items-center justify-center'>
      <form onSubmit={handleSubmit(createUser)} action="" className='flex flex-col gap-4 w-full max-w-xs'>
        <div className='flex flex-col gap-1'>
          <label htmlFor="">Email</label>
          <input type="email" className='border border-zin-200 shadow-sm rounded h-10 px-3 bg-zinc-800' {...register('email')} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        

        <div className='flex flex-col gap-1'>
          <label htmlFor="">Senha</label>
          <input type="password" className='border border-zin-200 shadow-sm rounded h-10 px-3 bg-zinc-800' {...register('password')} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <button className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600' type='submit'>Salvar</button>
      </form>
      <pre>{output}</pre>
    </main>
  )
}

export default App
