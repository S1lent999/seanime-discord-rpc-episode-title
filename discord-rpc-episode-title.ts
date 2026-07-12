/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />

function init() {
    $app.onDiscordPresenceAnimeActivityRequested((e) => {
        try {
            function isLinkDisabled() {
                return $storage.has("disableLink") ? $storage.get<boolean>("disableLink") : true;
            }
            
            function getDisplayFormat() {
                return $storage.has("displayFormat") ? $storage.get<string>("displayFormat") : "seasonEpisodeTitle";
            }
            
            function showEpisodeNumber() {
                return $storage.has("showEpisodeNumber") ? $storage.get<boolean>("showEpisodeNumber") : true;
            }

            if (e.animeActivity && !e.animeActivity.isMovie) {
                const animeTitle = e.animeActivity.title;
                const episodeNumber = e.animeActivity.episodeNumber;
                const episodeTitle = e.animeActivity.episodeTitle;
                
                const format = getDisplayFormat();
                const showNumber = showEpisodeNumber();

                if (episodeTitle) {
                    const season = e.animeActivity.season || 1;
                    const seasonStr = String(season).padStart(2, '0');
                    const episodeStr = String(episodeNumber).padStart(2, '0');
                    
                    e.name = animeTitle;
                    e.details = animeTitle;
                    
                    if (format === "seasonEpisodeTitle") {
                        e.state = showNumber ? `S${seasonStr}E${episodeStr} - ${episodeTitle}` : episodeTitle;
                    } else if (format === "episodeTitle") {
                        e.state = showNumber ? `Episode ${episodeNumber} - ${episodeTitle}` : episodeTitle;
                    } else if (format === "seasonEpisode") {
                        e.state = `S${seasonStr}E${episodeStr}`;
                    }
                } else {
                    e.name = animeTitle;
                    e.details = animeTitle;
                    e.state = showNumber ? `Episode ${episodeNumber}` : "Watching";
                }

                if (isLinkDisabled()) {
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

    $ui.register((ctx) => {
        const tray = ctx.newTray({
            iconUrl: "https://raw.githubusercontent.com/S1lent999/seanime-discord-rpc-episode-title/refs/heads/main/discord-logo.jpg",
            withContent: true,
            width: "280px",
        });

        const disableLinkRef = ctx.fieldRef<boolean>($storage.has("disableLink") ? $storage.get<boolean>("disableLink") : true);
        const displayFormatRef = ctx.fieldRef<string>($storage.has("displayFormat") ? $storage.get<string>("displayFormat") : "seasonEpisodeTitle");
        const showEpisodeNumberRef = ctx.fieldRef<boolean>($storage.has("showEpisodeNumber") ? $storage.get<boolean>("showEpisodeNumber") : true);

        disableLinkRef.onValueChange((value) => {
            $storage.set("disableLink", value);
        });
        
        displayFormatRef.onValueChange((value) => {
            $storage.set("displayFormat", value);
        });
        
        showEpisodeNumberRef.onValueChange((value) => {
            $storage.set("showEpisodeNumber", value);
        });

        const separator = () => {
            return tray.div([], { 
                style: { 
                    height: "1px", 
                    backgroundColor: "var(--color-border)", 
                    margin: "8px 0" 
                } 
            });
        };

        tray.render(() => {
            return tray.stack({
                items: [
                    tray.text("Discord RPC Episode Title", { className: "font-bold" }),
                    separator(),
                    tray.text("General", { className: "text-sm font-semibold" }),
                    tray.switch("Disable Anilist link from title", { fieldRef: disableLinkRef }),
                    tray.switch("Show episode number", { fieldRef: showEpisodeNumberRef }),
                    separator(),
                    tray.text("Display Format", { className: "text-sm font-semibold" }),
                    tray.select("Format", {
                        fieldRef: displayFormatRef,
                        options: [
                            { label: "S01E05 - Title", value: "seasonEpisodeTitle" },
                            { label: "Episode 5 - Title", value: "episodeTitle" },
                            { label: "S01E05", value: "seasonEpisode" },
                        ],
                    }),
                ],
            });
        });
    });
}
