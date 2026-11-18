<script lang="ts">
  // Per-version release announcement. Shown once after the user upgrades
  // to a new Aerion version. Only the explicit OK click records
  // acknowledgement (via onAcknowledge → SetLastSeenVersion in App.svelte).
  // Closing via ESC or outside-click leaves the version unrecorded, so
  // the dialog fires again on next launch.
  //
  // Per-release update workflow: bump Version in app/state.go, then edit
  // the body markup below to be the new release announcement.
  import { Dialog as DialogPrimitive } from 'bits-ui'
  import { cn } from '$lib/utils'
  import { Button } from '$lib/components/ui/button'
  // @ts-ignore - wailsjs path
  import { OpenURL } from '../../../wailsjs/go/app/App.js'
  import { _ } from '$lib/i18n'
  import { dialogGuardOpen, dialogGuardClose } from '$lib/stores/dialogGuard'

  interface Props {
    open: boolean
    onAcknowledge: () => void
  }

  let { open = $bindable(false), onAcknowledge }: Props = $props()

  // Hold the dialog guard while open so global shortcuts (Ctrl+, etc.) don't
  // fire behind this modal. Effect cleanup releases it on close and on
  // unmount-while-open (same pattern as ConfirmDialog).
  $effect(() => {
    if (!open) return
    dialogGuardOpen()
    return () => dialogGuardClose()
  })

  const CHANGELOG_URL = 'https://github.com/houssembenhacen/Zephyr/blob/main/CHANGELOG.md'

  // Open external links via the backend OpenURL: on Linux it tries the OpenURI
  // portal first, so links work inside the Flatpak sandbox (where xdg-open —
  // and thus Wails' BrowserOpenURL — can't reach the host browser).
  function openExternal(url: string) {
    OpenURL(url).catch((err: unknown) => console.error('Failed to open URL:', err))
  }
</script>

<DialogPrimitive.Root bind:open>
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogPrimitive.Content
      preventScroll={false}
      class={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 border bg-background p-8 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg'
      )}
    >
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h2 class="text-lg font-semibold leading-none tracking-tight">
          What's new?
        </h2>
      </div>

      <div class="space-y-4 max-h-[60vh] overflow-y-auto text-sm">
        <p>🚀 Welcome to Zephyr v1.0.0!</p>

        <p>Zephyr is your custom-built, lightweight desktop email, calendar, and contacts client:</p>

        <ul class="list-disc pl-6 space-y-1">
          <li>✉️ Multi-account IMAP/SMTP with IDLE push &amp; unified inbox</li>
          <li>🔐 End-to-end OpenPGP &amp; S/MIME signing and encryption</li>
          <li>📅 Integrated CalDAV, Google &amp; Outlook Calendar with reminders</li>
          <li>👥 Unified CardDAV, Google &amp; Microsoft Contacts</li>
          <li>🔍 Instant local SQLite FTS5 full-text search</li>
        </ul>
      </div>

      <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button onclick={onAcknowledge}>{$_('common.ok')}</Button>
      </div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
</DialogPrimitive.Root>
