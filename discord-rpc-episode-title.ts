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
            width: "260px",
        });

        const disableLinkRef = ctx.fieldRef<boolean>($storage.has("disableLink") ? $storage.get<boolean>("disableLink") : true);

        disableLinkRef.onValueChange((value) => {
            $storage.set("disableLink", value);
        });

        tray.render(() => {
            return tray.stack({
                items: [
                    tray.text("Discord RPC Episode Title"),
                    tray.switch("Disable anime link (non-clickable)", { fieldRef: disableLinkRef }),
                ],
            });
        });
    });
}
