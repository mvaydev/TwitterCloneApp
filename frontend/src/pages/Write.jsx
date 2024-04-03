import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { create } from '../api/PostApi'
import Block from '../layout/Block'
import Button from '../components/Button'
import markdownit from 'markdown-it'
import mdClass from 'markdown-it-class'

function Editor(props) {
    return (
        <>
            <div className='flex gap-3 items-center'>
                <input
                    type='text'
                    className='
                    border border-stone-300 rounded-md
                    p-1.5 w-full
                    shadow-xs
                    placeholder:font-light
                    focus:text-black
                    focus:outline-none
                    focus:shadow-sm
                    focus:shadow-slate-300
                    focus:border-slate-500'
                    onChange={e => props.setTitle(e.target.value)}
                    value={props.title}
                    placeholder='Название вашего поста'
                    maxLength={250}
                />
                <p className='w-20 text-right'>
                    {props.title.length + ' / 250'}
                </p>
            </div>

            <textarea className='
                border border-stone-300 rounded-md
                p-1.5 w-full min-h-32
                shadow-xs
                placeholder:font-light
                focus:text-black
                focus:outline-none
                focus:shadow-sm
                focus:shadow-slate-300
                focus:border-slate-500
                font-mono leading-tight'
                placeholder='Поделитесь мыслями с миром...'
                onChange={e => props.setContent(e.target.value)}
                value={props.content}
            ></textarea>
        </>
    )
}

function Preview(props) {
    const mapping = {
        h1: 'md-h1',
        h2: 'md-h2',
        h3: 'md-h3',
        h4: 'md-h4',
        h5: 'md-h5',
        h6: 'md-h6',
        a: 'md-link',
        img: 'md-img',
        hr: 'md-hr'
    }

    const md = markdownit( {
        html: false,
        typographer: true,
        linkify: true,
        breaks: true
    }).use(mdClass, mapping)

    const html = md.render(props.content)

    return (
        <div dangerouslySetInnerHTML={{__html: html}}></div>
    )
}

function ChangeMode(props) {
    return (
        <fieldset className='w-full flex justify-evenly'>
            <div className='w-full h-fit'>
                <input
                    type='radio'
                    id='edit'
                    className='peer/edit hidden'
                    name='isEditorMode'
                    onChange={() => props.setIsEditorMode(true)}
                    defaultChecked
                />

                <label
                    htmlFor='edit'
                    className='
                        block text-center
                        border border-r-0 rounded-l-md
                        px-4 py-1.5 w-full
                        hover:bg-stone-200 peer-checked/edit:bg-stone-100'
                >
                    Редактировать
                </label>
            </div>

            <div className='w-full h-fit'>
                <input
                    type='radio'
                    id='preview'
                    className='peer/preview hidden'
                    name='isEditorMode'
                    onChange={() => props.setIsEditorMode(false)}
                />

                <label
                    htmlFor='preview'
                    className='
                        block text-center
                        border border-l-0 rounded-r-md
                        px-4 py-1.5 w-full
                        hover:bg-stone-200 peer-checked/preview:bg-stone-100'
                >
                    Предпросмотр
                </label>
            </div>
        </fieldset>
    )
}

export default () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isEditorMode, setIsEditorMode] = useState(true)
    const navigate = useNavigate()

    const handlePublish = () => {
        if(title && content) create(title, content).then(() => navigate('/'))
    }

    return (
        <div className='w-full flex justify-center my-4'>

            <Block>
                <h1 className='text-xl font-bold'>Написать пост</h1>

                <ChangeMode setIsEditorMode={setIsEditorMode} />

                {
                    isEditorMode ?
                    <Editor {...{title, setTitle, content, setContent}} /> :
                    <Preview content={content} />
                }

                <Button onClickHandler={handlePublish}>Опубликовать</Button>
            </Block>
        </div>
    )
}
