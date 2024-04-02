<template>
  <div class="main">
    <div>
      <input
        type="file"
        @change="onFileChange"
      >
    </div>
    <vue-file-toolbar-menu
      :content="menu"
      class="bar"
    />
    <div style="font-family: Avenir, sans-serif">
      <!-- <vue-document-editor :content.sync="content" /> Vue 3 syntax -->
      <!-- <vue-document-editor :content.sync="content" /> --> <!-- Vue 2 syntax -->
      <vue-document-editor
        ref="editor"
        :content="content"
        class="editor"
        :overlay="overlay"
        :zoom="zoom"
        :page_format_mm="page_format_mm"
        :page_margins="page_margins"
        :display="display"
      />
    </div>
  </div>
</template>

<script>
import VueDocumentEditor from 'vue-document-editor'
import VueFileToolbarMenu from 'vue-file-toolbar-menu'

const mammoth = require('mammoth')

const options = {
  convertImage: mammoth.images.imgElement(),
  styleMap: [
    "p[style-name]='Section Title'=> h1:fresh",
    "p[style-name]='Subsection Title'=> h2:fresh",
    'u => em',
  ],
  includeDefaultStyleMap: false,
}

export default {
  components: { VueDocumentEditor, VueFileToolbarMenu },
  data() {
    return {
      // This is where the pages content is stored and synced
      content: ['<p style="text-align: center; margin-top: 0px; margin-bottom: 0px; line-height: 1"><span style="font-size: 24px; font-family: \'Times New Roman\', Times, serif"><strong>Document Sample Here</strong></span><span style="font-size: 16px; font-family: \'Times New Roman\', Times, serif">&nbsp;</span></p><p style="text-align: justify; margin-top: 0px; margin-bottom: 0px; line-height: 1">&nbsp;</p><p style="text-align: justify; margin-top: 0px; margin-bottom: 0px; margin-left: 48px; line-height: 1"><span style="font-s…e-height: 1"><span style="font-size: 16px; font-family: \'Times New Roman\', Times, serif"><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</strong></span></p><p style="text-align: justify; margin-top: 0px; margin-bottom: 0px; line-height: 1"><span style="font-size: 16px; font-family: \'Times New Roman\', Times, serif"><strong>&nbsp; &nbsp;&nbsp;</strong></span></p><p style="margin-top: 0px; margin-bottom: 0px; line-height: 1">&nbsp;</p><p style="margin-top: 0px; margin-bottom: 0px; line-height: 1">&nbsp;</p>'],
      zoom: 0.8,
      zoom_min: 0.10,
      zoom_max: 5.0,
      page_format_mm: [210, 297],
      page_margins: '10mm 15mm',
      display: 'grid', // ["grid", "vertical", "horizontal"]
      mounted: false, // will be true after this component is mounted
      undo_count: -1, // contains the number of times user can undo (= current position in content_history)
      content_history: [], // contains the content states for undo/redo operations
    }
  },
  computed: {
    menu() {
      return [
        // Main commands
        {
          // eslint-disable-next-line no-alert
          text: 'New', title: 'New', icon: 'description', click: () => { if (window.confirm('This will create an empty document. Are you sure?')) { this.content = ['']; this.resetContentHistory() } },
        },
        {
          text: 'Print', title: 'Print', icon: 'print', click: () => window.print(),
        },

        { is: 'spacer' },

        // Undo / redo commands
        {
          title: 'Undo', icon: 'undo', disabled: !this.can_undo, hotkey: this.isMacLike ? 'command+z' : 'ctrl+z', click: () => this.undo(),
        },
        {
          title: 'Redo', icon: 'redo', disabled: !this.can_redo, hotkey: this.isMacLike ? 'shift+command+z' : 'ctrl+y', click: () => this.redo(),
        },

        { is: 'spacer' },

        // Rich text menus
        {
          icon: 'format_align_left', title: 'Align left', active: this.isLeftAligned, disabled: !this.current_text_style, hotkey: this.isMacLike ? 'shift+command+l' : 'ctrl+shift+l', click: () => document.execCommand('justifyLeft'),
        },
        {
          icon: 'format_align_center', title: 'Align center', active: this.isCentered, disabled: !this.current_text_style, hotkey: this.isMacLike ? 'shift+command+e' : 'ctrl+shift+e', click: () => document.execCommand('justifyCenter'),
        },
        {
          icon: 'format_align_right', title: 'Align right', active: this.isRightAligned, disabled: !this.current_text_style, hotkey: this.isMacLike ? 'shift+command+r' : 'ctrl+shift+r', click: () => document.execCommand('justifyRight'),
        },
        {
          icon: 'format_align_justify', title: 'Justify content', active: this.isJustified, disabled: !this.current_text_style, hotkey: this.isMacLike ? 'shift+command+j' : 'ctrl+shift+j', click: () => document.execCommand('justifyFull'),
        },
        { is: 'separator' },
        {
          icon: 'format_bold', title: 'Bold', active: this.isBold, disabled: !this.current_text_style, hotkey: this.isMacLike ? 'command+b' : 'ctrl+b', click: () => document.execCommand('bold'),
        },
        {
          icon: 'format_italic', title: 'Italic', active: this.isItalic, disabled: !this.current_text_style, hotkey: this.isMacLike ? 'command+i' : 'ctrl+i', click: () => document.execCommand('italic'),
        },
        {
          icon: 'format_underline', title: 'Underline', active: this.isUnderline, disabled: !this.current_text_style, hotkey: this.isMacLike ? 'command+u' : 'ctrl+u', click: () => document.execCommand('underline'),
        },
        {
          icon: 'format_strikethrough', title: 'Strike through', active: this.isStrikeThrough, disabled: !this.current_text_style, click: () => document.execCommand('strikethrough'),
        },
        {
          is: 'button-color', type: 'compact', menu_class: 'align-center', disabled: !this.current_text_style, color: this.curColor, update_color: newColor => document.execCommand('foreColor', false, newColor.hex8),
        },
        { is: 'separator' },
        {
          icon: 'format_list_numbered', title: 'Numbered list', active: this.isNumberedList, disabled: !this.current_text_style, click: () => document.execCommand('insertOrderedList'),
        },
        {
          icon: 'format_list_bulleted', title: 'Bulleted list', active: this.isBulletedList, disabled: !this.current_text_style, click: () => document.execCommand('insertUnorderedList'),
        },
        {
          html: '<b>H1</b>', title: 'Header 1', active: this.isH1, disabled: !this.current_text_style, click: () => document.execCommand('formatBlock', false, '<h1>'),
        },
        {
          html: '<b>H2</b>', title: 'Header 2', active: this.isH2, disabled: !this.current_text_style, click: () => document.execCommand('formatBlock', false, '<h2>'),
        },
        {
          html: '<b>H3</b>', title: 'Header 3', active: this.isH3, disabled: !this.current_text_style, click: () => document.execCommand('formatBlock', false, '<h3>'),
        },
        {
          icon: 'format_clear', title: 'Clear format', disabled: !this.current_text_style, click() { document.execCommand('removeFormat'); document.execCommand('formatBlock', false, '<div>') },
        },
        {
          icon: 'splitscreen', title: 'Page break', disabled: !this.current_text_style, click: () => this.insertPageBreak(),
        },

        { is: 'spacer' },

        { // Format menu
          text: this.current_format_name,
          title: 'Format',
          icon: 'crop_free',
          chevron: true,
          menu: this.formats.map(([text, w, h]) => ({
            text,
            active: (this.page_format_mm[0] === w && this.page_format_mm[1] === h),
            click: () => { this.page_format_mm = [w, h] },
          })),
          menu_width: 80,
          menu_height: 280,
        },
        { // Margins menu
          text: this.current_margins_name,
          title: 'Margins',
          icon: 'select_all',
          chevron: true,
          menu: this.margins.map(([text, value]) => ({
            text: `${text} (${value})`,
            active: (this.page_margins === value),
            click: () => { this.page_margins = value },
          })),
          menu_width: 200,
          menu_class: 'align-center',
        },
        { // Zoom menu
          text: `${Math.floor(this.zoom * 100)}%`,
          title: 'Zoom',
          icon: 'zoom_in',
          chevron: true,
          menu: [
            ['200%', 2.0],
            ['150%', 1.5],
            ['125%', 1.25],
            ['100%', 1.0],
            ['75%', 0.75],
            ['50%', 0.5],
            ['25%', 0.25],
          ].map(([text, zoom]) => ({
            text,
            active: this.zoom === zoom,
            click: () => { this.zoom = zoom },
          })),
          menu_width: 80,
          menu_height: 280,
          menu_class: 'align-center',
        },
        { // Display mode menu
          title: 'Display',
          // eslint-disable-next-line no-nested-ternary
          icon: this.display === 'horizontal' ? 'view_column' : (this.display === 'vertical' ? 'view_stream' : 'view_module'),
          chevron: true,
          menu: [{
            icon: 'view_module',
            active: this.display === 'grid',
            click: () => { this.display = 'grid' },
          }, {
            icon: 'view_column',
            active: this.display === 'horizontal',
            click: () => { this.display = 'horizontal' },
          }, {
            icon: 'view_stream',
            active: this.display === 'vertical',
            click: () => { this.display = 'vertical' },
          }],
          menu_width: 55,
          menu_class: 'align-right',
        },
      ]
    },

    // Formats management
    current_format_name() {
      const format = this.formats.find(([, widthmm, heightmm]) => (this.page_format_mm[0] === widthmm && this.page_format_mm[1] === heightmm))
      return format ? format[0] : (`${this.page_format_mm[0]}mm x ${this.page_format_mm[1]}mm`)
    },
    formats: () => [
      ['A0', 841, 1189],
      ['A0L', 1189, 841],
      ['A1', 594, 841],
      ['A1L', 841, 594],
      ['A2', 420, 594],
      ['A2L', 594, 420],
      ['A3', 297, 420],
      ['A3L', 420, 297],
      ['A4', 210, 297],
      ['A4L', 297, 210],
      ['A5', 148, 210],
      ['A5L', 210, 148],
      ['A6', 105, 148],
      ['A6L', 148, 105],
    ],

    // Margins management
    current_margins_name() {
      const margins = this.margins.find(([, m]) => (this.page_margins === m))
      return margins ? margins[0] : this.page_margins
    },
    margins: () => [
      ['Medium', '20mm'],
      ['Small', '15mm'],
      ['Slim', '10mm 15mm'],
      ['Tiny', '5mm'],
    ],

    // Current text style management
    current_text_style() { return this.mounted ? this.$refs.editor.current_text_style : false },
    isLeftAligned() { return ['start', 'left', '-moz-left'].includes(this.current_text_style.textAlign) },
    isRightAligned() { return ['end', 'right', '-moz-right'].includes(this.current_text_style.textAlign) },
    isCentered() { return ['center', '-moz-center'].includes(this.current_text_style.textAlign) },
    isJustified() { return ['justify', 'justify-all'].includes(this.current_text_style.textAlign) },
    isBold() {
      const { fontWeight } = this.current_text_style
      // eslint-disable-next-line radix
      return fontWeight && (parseInt(fontWeight) > 400 || fontWeight.indexOf('bold') === 0)
    },
    isItalic() { return this.current_text_style.fontStyle === 'italic' },
    isUnderline() { // text-decoration is not overridden by children, so we query the parent stack
      const stack = this.current_text_style.textDecorationStack
      return stack && stack.some(d => (d.indexOf('underline') === 0))
    },
    isStrikeThrough() { // text-decoration is not overridden by children, so we query the parent stack
      const stack = this.current_text_style.textDecorationStack
      return stack && stack.some(d => (d.indexOf('line-through') === 0))
    },
    isNumberedList() { return this.current_text_style.isList && this.current_text_style.listStyleType === 'decimal' },
    isBulletedList() { return this.current_text_style.isList && ['disc', 'circle'].includes(this.current_text_style.listStyleType) },
    isH1() { return this.current_text_style.headerLevel === 1 },
    isH2() { return this.current_text_style.headerLevel === 2 },
    isH3() { return this.current_text_style.headerLevel === 3 },
    curColor() { return this.current_text_style.color || 'transparent' },

    // Platform management
    isMacLike: () => /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),

    // Undo / redo flags
    can_undo() { return this.undo_count > 0 },
    can_redo() { return this.content_history.length - this.undo_count - 1 > 0 },
  },
  watch: {
    content: {
      immediate: true,
      // Fill undo / redo history stack on user input
      handler(newContent) {
        if (!this.mute_next_content_watcher) { // only update the stack when content is changed by user input, not undo/redo commands
          // eslint-disable-next-line no-plusplus
          this.content_history[++this.undo_count] = newContent
          this.content_history.length = this.undo_count + 1 // remove all redo items
        }
        this.mute_next_content_watcher = false
      },
    },
  },
  created() {
    // Initialize gesture flags
    let startZoomGesture = false
    let startDistTouch = false
    let startZoomTouch = false

    // Manage ctrl+scroll zoom (or trackpad pinch)
    window.addEventListener('wheel', e => {
      if (e.ctrlKey) {
        e.preventDefault()
        this.zoom = Math.min(Math.max(this.zoom - e.deltaY * 0.01, this.zoom_min), this.zoom_max)
      }
    }, { passive: false })

    // Manage trackpad pinch on Safari
    window.addEventListener('gesturestart', e => {
      e.preventDefault()
      startZoomGesture = this.zoom
    })
    window.addEventListener('gesturechange', e => {
      e.preventDefault()
      if (!startZoomTouch) {
        this.zoom = Math.min(Math.max(startZoomGesture * e.scale, this.zoom_min), this.zoom_max)
      }
    })
    window.addEventListener('gestureend', () => {
      startZoomGesture = false
    })

    // Manage pinch to zoom for touch devices
    window.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        e.preventDefault()
        startDistTouch = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY,
        )
        startZoomTouch = this.zoom
      }
    }, { passive: false })
    window.addEventListener('touchmove', e => {
      if (startDistTouch && startZoomTouch) {
        e.preventDefault()
        const zoom = (startZoomTouch * Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY,
        )) / startDistTouch
        this.zoom = Math.min(Math.max(zoom, this.zoom_min), this.zoom_max)
      }
    }, { passive: false })
    window.addEventListener('touchend', () => {
      startDistTouch = false
      startZoomTouch = false
    }, { passive: false })

    // Manage history undo/redo events
    // eslint-disable-next-line camelcase
    const manage_undo_redo = e => {
      // eslint-disable-next-line default-case
      switch (e && e.inputType) {
        case 'historyUndo': e.preventDefault(); e.stopPropagation(); this.undo(); break
        case 'historyRedo': e.preventDefault(); e.stopPropagation(); this.redo(); break
      }
    }
    window.addEventListener('beforeinput', manage_undo_redo)
    window.addEventListener('input', manage_undo_redo) // in case of beforeinput event is not implemented (Firefox)

    // If your component is susceptible to be destroyed, don't forget to
    // use window.removeEventListener in the Vue.js beforeUnmount handler
  },
  mounted() {
    this.mounted = true
  },
  methods: {
    // Page overlays (headers, footers, page numbers)
    overlay(page, total) {
      // Add page numbers on each page
      let html = `<div style="position: absolute; bottom: 8mm; ${(page % 2) ? 'right' : 'left'}: 10mm">Page ${page} of ${total}</div>`

      // Add custom headers and footers from page 3
      if (page >= 3) {
        html += '<div style="position: absolute; left: 0; top: 0; right: 0; padding: 3mm 5mm; background: rgba(200, 220, 240, 0.5)"><strong>MYCOMPANY</strong> example.com /// This is a custom header overlay</div>'
        html += '<div style="position: absolute; left: 10mm; right: 10mm; bottom: 5mm; text-align:center; font-size:10pt">MY COMPANY - example.com /// This is a custom footer overlay</div>'
      }
      return html
    },

    // Undo / redo functions examples
    // eslint-disable-next-line no-plusplus
    undo() { if (this.can_undo) { this.mute_next_content_watcher = true; this.content = this.content_history[--this.undo_count] } },
    // eslint-disable-next-line no-plusplus
    redo() { if (this.can_redo) { this.mute_next_content_watcher = true; this.content = this.content_history[++this.undo_count] } },
    resetContentHistory() { this.content_history = []; this.undo_count = -1 },

    // Insert page break function example
    async insertPageBreak() {
      // insert paragraph at caret position
      document.execCommand('insertParagraph')

      // insert a marker at caret position (start of the new paragraph)
      const marker = '###PB###' // must be regex compatible
      document.execCommand('insertText', false, marker)

      // wait for v-model content update (two ticks are needed to reactivate watch on content)
      await this.$nextTick()
      await this.$nextTick()

      // find the marker inside content items and split this content item in two items between the two paragraphs
      // only match root tags (p, div, h1, h2...) to avoid non-root tags like <li>
      const regexp = new RegExp(`<(p|div|h\\d)( [^/>]+)*>(<[^/>]+>)*${marker}`)
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.content.length; i++) {
        const item = this.content[i]
        if (typeof item !== 'string') {
          const match = regexp.exec(item)

          if (match) {
            const tagsOpen = match[0].slice(0, -marker.length)
            let contentPlusTagsClose = item.substr(match.index + match[0].length)
            // insert <br> to empty pages that would not be handled correctly by contenteditable
            if (contentPlusTagsClose.indexOf('</') === 0) contentPlusTagsClose = `<br>${contentPlusTagsClose}`
            this.content.splice(i, 1, item.substr(0, match.index), tagsOpen + contentPlusTagsClose)
            return
          }
        }
      }

      // if the code didn't return before, the split didn't work (e.g. inside a <li>). just remove the marker from the content
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.content.length; i++) {
        const item = this.content[i]
        if (typeof item !== 'string' || item.indexOf(marker) < 0) {
          this.content.splice(i, 1, item.replace(marker, ''))
          break
        }
      }
    },
    async onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      const reader = new FileReader()
      console.log(files[0])
      const that = this
      that.content = []
      // eslint-disable-next-line func-names
      reader.onload = async function (loadEvent) {
        console.log('onload: ', e)
        const arrayBuffer = loadEvent.target.result
        console.log('buffer: ', arrayBuffer)
        const result = await mammoth.convertToHtml({ arrayBuffer }, options)
        console.log('result: ', result)
        // const $ = cheerio.load(result.value)
        // $('a').attr('target', '_blank')
        // $('a').attr('rel', 'noopener')
        that.content = [result.value]
      }

      reader.readAsArrayBuffer(files[0])
    },
  },
}
</script>
