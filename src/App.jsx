import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import './styles/global.css';

const createUserFormSchema = z.object({
  name: z.string()
    .nonempty({message: 'O nome é obrigatório'})
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),

  email: z.string()
    .nonempty({message: 'O email é obrigatório'})
    .email({message: 'Formato de email inválido'})
    .refine(email => {
      return email.endsWith('@gmail.com')
    }, {message: 'O e-mail precisa ser gmail'}),

  password: z.string()
    .min(6, {message: 'A senha precisa de no mínimo 6 caracteres'}),

  techs: z.array(z.object({
    title: z.string().nonempty({message: 'O título é obrigatório'}),
    knowledge: z.coerce.number().min(1, {message: 'O nível de conhecimento deve ser de 1 a 10'}).max(10, {message: 'O nível de conhecimento deve ser de 1 a 10'})
  })).min(2, {message: 'Insira pelo menos 2 tecnologias'})
});

function App() {
  const [output, setOutput] = useState('');

  const { 
    register, 
    handleSubmit, 
    control, 
    formState: {errors} 
  } = useForm({ resolver: zodResolver(createUserFormSchema) });

  const { fields, append, remove} = useFieldArray({
    control,
    name: 'techs',
  });

  function addNewTech() {
    append({title: ''})
  };
  
  function createUser(data) {
    setOutput(JSON.stringify(data,null,2))
  }
  return (
    <main className=' text-zinc-50 flex flex-col items-center pt-10 justify-center'>
      <form onSubmit={handleSubmit(createUser)} action="" className='flex flex-col bg-zinc-900 gap-4 w-full max-w-md p-3'>

        <div className='flex flex-col gap-1'>
          <label htmlFor="name">Nome</label>
          <input type="text" className='border border-zin-200 shadow-sm rounded h-10 px-3 bg-zinc-800' {...register('name')} />
          {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="email">Email</label>
          <input type="email" className='border border-zin-200 shadow-sm rounded h-10 px-3 bg-zinc-800' {...register('email')} />
          {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
        </div>
          

        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Senha</label>
          <input type="password" className='border border-zin-200 shadow-sm rounded h-10 px-3 bg-zinc-800' {...register('password')} />
          {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="password" className='flex items-center justify-between'>
            Tecnologias
            <button type='button' onClick={addNewTech} className='text-emerald-500 text-sm bg-zinc-900'>Adicionar</button>
          </label>
          
          {fields.map((field, index) => {
            return (
              <div className='flex gap-2' key={field.id}> 
                <div className="flex flex-col gap-1">
                  <input type="text" className='flex-1 border border-zin-200 shadow-sm rounded h-10 px-3 bg-zinc-800' placeholder='Digite o título' {...register(`techs.${index}.title`)} />
                  {errors.techs?.[index]?.title && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.title.message}</span>}
                </div>
                
                <div className="flex flex-col gap-1">
                  <input type="number" className='w-full border border-zin-200 shadow-sm rounded h-10 px-3 bg-zinc-800' placeholder='Digite seu nível de skill' {...register(`techs.${index}.knowledge`)} />
                  {errors.techs?.[index]?.knowledge && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.knowledge.message}</span>}
                </div>
              </div>
            )
          })}
          {errors.techs && <span className='text-red-500 text-sm'>{errors.techs.message}</span>}
        </div>

          <button className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600' type='submit'>Salvar</button>
      </form>
      
      {output && (
        <pre className='text-sm my-5  bg-zinc-800 text-zinc-100 p-6 rounded-lg'>
          {output}
        </pre>
      )}
    </main>
  )
}

export default App
