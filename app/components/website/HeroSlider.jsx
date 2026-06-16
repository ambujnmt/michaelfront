'use client'

import { useEffect, memo } from 'react'

const HeroSlider = memo(function HeroSlider() {
  useEffect(() => {
    let retryTimer = null
    const tryInit = () => {
      if (typeof window === 'undefined') return
      const jq = window.jQuery
      if (!jq || !jq.fn || !jq.fn.revolution) { retryTimer = setTimeout(tryInit, 500); return }
      const $el = jq('#rev_slider_149_1')
      if (!$el.length || $el.hasClass('revslider-initialised')) return
      $el.show().revolution({
        sliderType: 'standard',
        jsFileLocation: '/assets/plugins/revolution/revolution/js/',
        sliderLayout: 'fullscreen',
        dottedOverlay: 'none',
        delay: 9000,
        navigation: {
          keyboardNavigation: 'off', keyboard_direction: 'horizontal',
          mouseScrollNavigation: 'off', mouseScrollReverse: 'default', onHoverStop: 'off',
          touch: { touchenabled: 'on', swipe_threshold: 75, swipe_min_touches: 1, swipe_direction: 'horizontal', drag_block_vertical: false },
          arrows: { enable: true, style: 'ares', hide_onmobile: false, hide_onleave: false,
            left: { h_align: 'left', v_align: 'center', h_offset: 30, v_offset: 0 },
            right: { h_align: 'right', v_align: 'center', h_offset: 30, v_offset: 0 } },
          bullets: { enable: false },
        },
        responsiveLevels: [1240, 1024, 778, 480], visibilityLevels: [1240, 1024, 778, 480],
        gridwidth: [1400, 1240, 778, 480], gridheight: [868, 768, 960, 720],
        lazyType: 'none', shadow: 0, spinner: 'spinner2',
        stopLoop: 'on', stopAfterLoops: 0, stopAtSlide: 1, shuffle: 'off',
        autoHeight: 'off', fullScreenAutoWidth: 'off', fullScreenAlignForce: 'off',
        fullScreenOffsetContainer: '.site-header', fullScreenOffset: '',
        disableProgressBar: 'on', hideThumbsOnMobile: 'off',
        hideSliderAtLimit: 0, hideCaptionAtLimit: 0, hideAllCaptionAtLilmit: 0,
        debugMode: false,
        fallbacks: { simplifyAll: 'off', nextSlideOnWindowFocus: 'off', disableFocusListener: false },
      })
    }
    const timer = setTimeout(tryInit, 800)
    return () => { clearTimeout(timer); clearTimeout(retryTimer) }
  }, [])

  return (
    <div id="rev_slider_149_1_wrapper" className="rev_slider_wrapper fullscreen-container"
      data-alias="snowaddon1" data-source="gallery"
      style={{ backgroundColor: '#2d3032', padding: '0px' }}>
      <div id="rev_slider_149_1" className="rev_slider fullscreenbanner"
        style={{ display: 'none' }} data-version="5.4.1">
        <ul>
          <li data-index="rs-407" data-transition="fade" data-slotamount="default"
            data-hideafterloop="0" data-hideslideonmobile="off"
            data-easein="default" data-easeout="default" data-masterspeed="2000"
            data-thumb="images/main-slider/slider5/slide1.jpg" data-rotate="0"
            data-fstransition="fade" data-fsmasterspeed="1000" data-fsslotamount="7"
            data-saveperformance="off" data-title="One"
            data-param1="" data-param2="" data-param3="" data-param4="" data-param5=""
            data-param6="" data-param7="" data-param8="" data-param9="" data-param10=""
            data-description="">
            <img src="/assets/img/p8-hero-bg.png" alt="image"
              data-bgposition="center center" data-kenburns="on" data-duration="20000"
              data-ease="Linear.easeNone" data-scalestart="130" data-scaleend="100"
              data-rotatestart="0" data-rotateend="0"
              data-offsetstart="0 0" data-offsetend="0 0" data-bgparallax="6"
              className="rev-slidebg" data-no-retina />
            <div id="rrzm_407" className="rev_row_zone rev_row_zone_middle" style={{ zIndex: 6 }}>
              <div className="tp-caption" id="slide-407-layer-14"
                data-x="['left','left','left','left']" data-hoffset="['100','100','100','100']"
                data-y="['middle','middle','middle','middle']" data-voffset="['0','0','0','0']"
                data-width="none" data-height="none" data-whitespace="nowrap"
                data-type="row" data-columnbreak="2" data-basealign="slide"
                data-responsive_offset="on" data-responsive="off"
                data-frames='[{"delay":10,"speed":300,"frame":"0","from":"opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"Power3.easeInOut"}]'
                data-margintop="[0,0,0,0]" data-marginright="[0,0,0,0]"
                data-marginbottom="[0,0,0,0]" data-marginleft="[0,0,0,0]"
                data-textalign="['inherit','inherit','inherit','inherit']"
                data-paddingtop="[0,0,0,0]" data-paddingright="[100,50,50,50]"
                data-paddingbottom="[0,0,0,0]" data-paddingleft="[100,50,50,50]"
                style={{ zIndex: 6, whiteSpace: 'nowrap', fontSize: '20px', lineHeight: '22px', fontWeight: '400', color: 'rgba(255,255,255,1.00)' }}>
                <div className="tp-caption" id="slide-407-layer-15"
                  data-x="['left','left','left','left']" data-hoffset="['100','100','100','100']"
                  data-y="['top','top','top','top']" data-voffset="['100','100','100','100']"
                  data-width="none" data-height="none" data-whitespace="nowrap"
                  data-type="column" data-responsive_offset="on" data-responsive="off"
                  data-frames='[{"delay":"+0","speed":300,"frame":"0","from":"opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"Power3.easeInOut"}]'
                  data-columnwidth="100%"
                  data-margintop="[0,0,0,0]" data-marginright="[0,0,0,0]"
                  data-marginbottom="[0,0,0,0]" data-marginleft="[0,0,0,0]"
                  data-textalign="['center','center','center','center']"
                  data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,0,0]"
                  data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,0,0]"
                  style={{ zIndex: 7, width: '100%' }}>
                  <div className="tp-caption tp-resizeme" id="slide-407-layer-1"
                    data-x="['left','left','center','center']" data-hoffset="['0','0','0','0']"
                    data-y="['top','top','top','top']" data-voffset="['0','0','230','110']"
                    data-fontsize="['110','90','100','70']" data-lineheight="['100','90','100','70']"
                    data-width="['none','none','697','399']" data-height="none"
                    data-whitespace="['nowrap','nowrap','normal','normal']"
                    data-type="text" data-basealign="slide" data-responsive_offset="on"
                    data-frames='[{"delay":"+290","split":"chars","splitdelay":0.05,"speed":750,"frame":"0","from":"y:40px;sX:1.5;sY:1.5;opacity:0;fb:20px;","to":"o:1;fb:0;","ease":"Power4.easeOut"},{"delay":"wait","speed":1000,"frame":"999","to":"sX:1;sY:1;opacity:0;fb:10px;","ease":"Power4.easeOut"}]'
                    data-margintop="[0,0,0,0]" data-marginright="[0,0,0,0]"
                    data-marginbottom="[30,20,30,30]" data-marginleft="[0,0,0,0]"
                    data-textalign="['inherit','inherit','center','center']"
                    data-paddingtop="[0,0,0,0]" data-paddingright="[0,0,40,40]"
                    data-paddingbottom="[0,0,0,0]" data-paddingleft="[0,0,40,40]"
                    style={{ zIndex: 8, whiteSpace: 'nowrap', fontWeight: '200', color: '#fff', display: 'inline-block', fontFamily: 'var(--head-font)', letterSpacing: '-5px' }}
                  />
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div className="tp-bannertimer" style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.25)' }}></div>
      </div>
    </div>
  )
}, () => true)

export default HeroSlider
