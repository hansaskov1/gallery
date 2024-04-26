import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { readPhotosFromPublicDirectory } from './photos';

export const BaseHtml = ({ children }: { children: undefined | {} }) => (
    <html lang="en">
        <head>
            <meta charset='utf-8' />
            <meta name="color-scheme" content="light dark" />
            <link rel="stylesheet" href="public/css/pico.slate.min.css" />
            <title>Hello World</title>
        </head>
        <body>
            <header>
                <Navbar />
            </header>
            <main class="container">
                {children}
            </main>
        </body>
    </html>
);



export const Navbar = () => (
    <nav class="container-fluid">
        <ul>
            <li><strong>Acme Corp</strong></li>
        </ul>
        <ul>
            <li><a href="#" class="contrast">About</a></li>
            <li><a href="#" class="contrast">Services</a></li>
            <li><a href="#" class="contrast">Products</a></li>
        </ul>
    </nav>
)


new Elysia()
    .use(staticPlugin())
    .use(html())
    .get('/favicon.ico', () => Bun.file('public/favicon.ico'))
    .get('/', async () => {

        const photoConfigs = await readPhotosFromPublicDirectory()
        return (
            <BaseHtml>

                <div class="grid">
                    {photoConfigs.map(({ fileName }) => (
                        <>
                            <img src={fileName} ></img>
                        </>

                    ))}

                </div>

                <fieldset class="grid">
                    <input
                        type="text"
                        name="login"
                        placeholder="Login"
                        aria-label="Login"
                        autocomplete="username"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        aria-label="Password"
                    />
                    <button type="submit">Log in</button>
                </fieldset>
            </BaseHtml>
        )
    })
    .listen(3000)

