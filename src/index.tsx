import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { PhotoConfig, readPhotosFromPublicDirectory } from './photos';

export const BaseHtml = ({ children }: { children: undefined | {} }) => (
    <html lang="en">
        <head>
            <meta charset='utf-8' />
            <meta name="color-scheme" content="light dark" />
            <link rel="stylesheet" href="public/css/pico.slate.min.css" />
            <link rel="stylesheet" href="public/css/main.css" />
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

export const PhotoConfigTable = ({ config }: { config: PhotoConfig }) => {

    const [date, time] = config.createDate.split(" ")

    return <>
        <table>
            <tr>
                <th>Key</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Date</td>
                <td>{date}</td>
            </tr>
            <tr>
                <td>Time</td>
                <td>{time}</td>
            </tr>
            <tr>
                <td>Time since epoch</td>
                <td>{config.createSecondsEpoc}</td>
            </tr>
            <tr>
                <td>Exposure time</td>
                <td>{config.exposureTime}</td>
            </tr>
            <tr>
                <td>Distance to subject</td>
                <td>{config.subjectDistance}</td>
            </tr>
            <tr>
                <td>ISO</td>
                <td>{config.ISO}</td>
            </tr>
            <tr>
                <td>Trigger method</td>
                <td>{config.trigger}</td>
            </tr>
        </table>
    </>
}

export const Photo = ({ config }: { config: PhotoConfig }) => {
    return (
        <>
            <img src={config.fileName} onclick="this.nextElementSibling.showModal()" />
            <dialog>
                <article>
                    <header>
                        <button aria-label="Close" rel="prev" onclick="this.closest('dialog').close()"></button>
                        <p>
                            <strong>Picture</strong>
                        </p>
                    </header>
                    <PhotoConfigTable config={config} />
                </article>
            </dialog>


        </>
    );
};


new Elysia()
    .use(staticPlugin())
    .use(html())
    .get('/favicon.ico', () => Bun.file('public/favicon.ico'))
    .get('/', async () => {

        const photoConfigs = await readPhotosFromPublicDirectory()
        return (
            <BaseHtml>


                <div class="grid-fluid">
                    {photoConfigs.map((config) => (
                        <>
                            <Photo config={config} />
                        </>
                    ))}
                </div>
            </BaseHtml>
        )
    })
    .listen(3000)

