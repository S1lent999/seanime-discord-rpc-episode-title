/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />

const disableLink = "{{disableLink}}";
const showEpisodeNumber = "{{showEpisodeNumber}}";
const displayFormat = "{{displayFormat}}";

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
                    
                    if (displayFormat === "seasonEpisodeTitle") {
                        e.state = showEpisodeNumber === "true" ? `S${seasonStr}E${episodeStr} - ${episodeTitle}` : episodeTitle;
                    } else if (displayFormat === "episodeTitle") {
                        e.state = showEpisodeNumber === "true" ? `Episode ${episodeNumber} - ${episodeTitle}` : episodeTitle;
                    } else if (displayFormat === "seasonEpisode") {
                        e.state = `S${seasonStr}E${episodeStr}`;
                    }
                } else {
                    e.name = animeTitle;
                    e.details = animeTitle;
                    e.state = showEpisodeNumber === "true" ? `Episode ${episodeNumber}` : "Watching";
                }

                if (disableLink === "true") {
                    e.detailsUrl = "";
                    e.largeUrl = "";
                }
            }
        } catch (err) {
            $debug.error("[Discord RPC] Error:", err);
        }
        e.next();
    });

    $app.onDiscordPresenceMangaActivityRequested((e) => {
        e.next();
    });
}
