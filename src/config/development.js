module.exports = {
    api: {
        port: 9520,
        prefix: "/api/v1",
        authentication: {
            secretKey: "vcworkspace2020",
            tokenHeaderField: "token",
        }
    },
    app: {
        password: {
            saltRounds: 10
        }
    },
    database: {
        mongo: {
            uri: "mongodb+srv://devphuc:G7t2MkBgMPP5sIOg@cluster0.eoy1d.mongodb.net/instagram-clone?retryWrites=true&w=majority",
            options: {
                useNewUrlParser: true, useUnifiedTopology: true,
            }
        },
        redis: {

        }
    },
    socket: {
        name: "Websocket",
        port: 9521,
        prefix: "/",
        log: {
            prefix: "Websocket"
        },
        defaultEvent: {
            "ping": "@common/ping",
            "pong": "@common/pong"
        }
    },
    storage: {
        rootPath: "/upload",
        isRelativePath: true,
        name: "CDN-01",
        mutilStorage: {
            enable: true,
            isMaster: false,
            consumerConfig: {
                masterURlConnect: "http://localhost:9522/consumer",
                event: {
                    connect: "@consumer/connect",
                    download: "@consumer/download"
                }
            },
        },
        limit: 15, // MB
        groupPath: {
            image: "/image",
            doc: "/doc",
            other: "/other",
            temp: "/temp",
            audio: "/audio",
            video: "/video"
        },
        bodyField: "file",
        // multiSupport: false,  // default false, update later
        mimeGroup: {
            image: [
                "image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/bmp",
            ],
            other: [
                "application/zip",
                "application/x-7z-compressed",
                "application/x-rar-compressed",
                "application/octet-stream"
            ],
            doc: [
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "text/plain",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/pdf"
            ],
            video: [
                "video/x-flv",
                "video/mp4",
                "video/3gpp",
            ],
            audio: [
                "audio/m4a",
                "audio/mpeg",
                "audio/vnd.wav",
                "audio/mpeg",
                "audio/aac",
                "audio/mpeg3",
                "audio/webm",
                "audio/ogg",
                "audio/wav",
                "audio/mpeg-3"
            ]
        },
        cacheOptions: {
            enable: true,
            options: {
                "max-age": 3600
            }
        }
    }
}