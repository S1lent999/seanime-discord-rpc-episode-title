/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />

//@ts-ignore
function init() {
    $app.onDiscordPresenceAnimeActivityRequested((e) => {
        try {
            if (e.animeActivity && !e.animeActivity.isMovie) {
                const animeTitle = e.animeActivity.title;
                const episodeNumber = e.animeActivity.episodeNumber;
                const episodeTitle = e.animeActivity.episodeTitle;

                if (episodeTitle) {
                    const season = e.animeActivity.season || 1;
                    const seasonStr = String(season).padStart(2, '0');
                    const episodeStr = String(episodeNumber).padStart(2, '0');

                    e.name = animeTitle;
                    e.details = animeTitle;
                    e.state = `S${seasonStr}E${episodeStr} - ${episodeTitle}`;
                } else {
                    e.state = `Episode ${episodeNumber}`;
                }
            }
        } catch (err) {
            $debug.error("[Discord RPC Episode Title] Error:", err);
        }
        e.next();
    });

    $app.onDiscordPresenceMangaActivityRequested((e) => {
        e.next();
    });
}