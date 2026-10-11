U="https://susithd.github.io/pickme-first-session/?embed=1&v=2&scene="
def ph(scene,w=300,cap=None,sub=None):
    h=round(w*868/414)
    c=f'<div class="cap"><b>{cap}</b><span>{sub or ""}</span></div>' if cap else ''
    return f'<figure class="ph"><iframe src="{U}{scene}" width="{w}" height="{h}" scrolling="no" loading="eager" title="{scene}"></iframe>{c}</figure>'
def head(eb,title,sub=None):
    s=f'<p class="sub">{sub}</p>' if sub else ''
    return f'<div class="eb"><span class="pill">{eb}</span></div><h2>{title}</h2>{s}'
def board(i,body,cls=""):
    return f'<section class="board {cls}" id="b{i:02d}">{body}<div class="foot"><span>Unofficial concept · Not affiliated with PickMe</span><span>{i:02d} / 12</span></div></section>\n'
B=[]
B.append(f'''<section class="board cover" id="b01"><div class="eb"><span class="pill">UI/UX CASE STUDY · UNOFFICIAL CONCEPT</span></div>
<h1>A first ride you can <em>trust</em></h1>
<p class="sub">A growth redesign of PickMe's new-rider first session in Sri Lanka, from install to receipt.</p>
<div class="row phones cover-ph">{ph("welcome-treatment",300)}{ph("ride-treatment",340)}{ph("receipt-delta",300)}</div>
<div class="foot c"><span>Not affiliated with PickMe · Desk research · Coded prototype</span></div></section>\n''')
cards=[("01","Fare above the estimate","Reviewers say the final charge came in well over the fare shown at booking."),
("02","A trip only the driver can end","Reviewers say the trip stays open after arrival and the meter or card charge keeps going."),
("03","Cash demanded on card trips","Reviewers say drivers ask for cash although the ride was set up to pay by card."),
("04","Support that does not answer","Reviewers say tickets are closed without an answer and promised callbacks never came.")]
cd="".join(f'<div class="card"><span class="mono n">{n}</span><h3>{t}</h3><p>{d}</p></div>' for n,t,d in cards)
B.append(board(2,head("THE PROBLEM","Trust is won or lost in the <em>first session</em>","Public reviews of PickMe in Sri Lanka raise four themes, each reported by roughly five reviewers.")+f'<div class="grid2">{cd}</div><div class="note"><b>Evidence note.</b> About 30 public reviews and posts; several were seen only as search snippets. These are reviewer reports, not verified in the app.</div>'))
B.append(board(3,head("RESEARCH & EVIDENCE","What the desk research <em>can</em> and cannot say")+'''
<div class="grid3">
<div class="card"><h3>Sources</h3><ul><li>About 30 dated public reviews and posts (Trustpilot, App Store, LinkedIn, press)</li><li>6-app benchmark from help pages and articles: Uber, Grab, Gojek, Careem, Bolt, Rapido</li><li>No interviews. No PickMe data.</li></ul></div>
<div class="card"><h3>Found</h3><ul><li>Four repeated trust themes at fare, trip end, payment and support</li><li>Benchmark patterns for upfront fares and fare-before-signup</li></ul></div>
<div class="card gap"><h3>Not found</h3><ul><li>No evidence either way on signup, OTP or permissions. That is a gap, not a finding.</li><li>No public funnel rates, so none are claimed.</li></ul></div></div>
<h3 class="lab">Funnel stages and evidence strength</h3>
<div class="funnel">
<div><span class="mono">Install and signup</span><i class="bar w1"></i><em>None</em></div>
<div><span class="mono">First fare view</span><i class="bar w2"></i><em>Benchmark only</em></div>
<div><span class="mono">Booking and matching</span><i class="bar w3"></i><em>Reviews, some snippets</em></div>
<div><span class="mono">Trip, drop-off, payment</span><i class="bar w4"></i><em>Repeated reviews</em></div>
<div><span class="mono">Receipt and support</span><i class="bar w4"></i><em>Repeated reviews</em></div></div>'''))
B.append(board(4,head("TWO BETS","Fix the fare trust first, then the <em>front door</em>")+'''
<div class="grid2 tall">
<div class="card big"><span class="tag">PART B · PRIMARY</span><h3>A fare you can hold</h3><p class="ifthen"><b>If</b> the booking screen shows a fixed fare, its breakdown and the only three things that can change it, and the receipt explains any difference, <b>then</b> riders book and ride again, <b>because</b> reviewers repeatedly report a gap between the fare shown and the fare charged.</p><p class="conf">Evidence: repeated review reports plus benchmark</p></div>
<div class="card big alt"><span class="tag">PART A · SUPPORTING</span><h3>Fare before account</h3><p class="ifthen"><b>If</b> a new rider sees their own fare before signing up and the code step moves to Book, <b>then</b> more reach a first booking, <b>because</b> leading apps show the price first.</p><p class="conf">Evidence: benchmark only, lower confidence</p></div></div>'''))
cl=[("Fixed fare, not an estimate","The fare is shown as a fixed number rather than a range."),("Breakdown and change rules","Base, distance and peak are itemised, with the three proposed reasons it could change."),("Receipt explains the delta","Any difference is listed line by line before payment.")]
B.append(board(5,head("BEFORE / AFTER","One screen, <em>one promise</em>")+f'''<div class="row phones">{ph("ride-control",300,"Control · generic pattern","Not PickMe's interface")}{ph("ride-treatment",300,"Treatment · fixed fare","Fare, breakdown, change rules")}</div>
<div class="grid3 callouts">{"".join(f'<div class="call"><span class="mono n">0{i+1}</span><h3>{t}</h3><p>{d}</p></div>' for i,(t,d) in enumerate(cl))}</div>'''))
def flow(i,eb,title,sub,items):
    return board(i,head(eb,title,sub)+'<div class="row phones">'+"".join(ph(s,270,c,d) for s,c,d in items)+'</div>')
B.append(flow(6,"PART A · THE FRONT DOOR","Fare before <em>account</em>","Fare before account; phone and code only at Book.",[("welcome-treatment","Welcome","Start from the ride, not a form"),("where","Where to","Pickup and drop-off, then the fare"),("verify","Verify at Book","Phone and code only when booking")]))
B.append(flow(7,"PART B · BOOKING","A fare you can <em>hold</em>","Fixed fare, its breakdown and the three proposed things that could change it.",[("ride-treatment","Fixed fare","Ride options with the held fare"),("fare-sheet","Breakdown","What is in the fare, and what could change it"),("finding-matched","Matched","Driver found, fare still fixed")]))
B.append(flow(8,"PART B · THE TRIP","Changes are <em>asked</em>, then explained","A route change needs the rider's approval, and the receipt shows the difference.",[("trip-route-change","Route change","Rider approves before the fare moves"),("arrived","Arrived","Trip end without guesswork"),("receipt-delta","Receipt","Difference explained line by line")]))
B.append(flow(9,"EDGE STATES","When the ride <em>does not go to plan</em>","Scripted scenarios in the prototype, with invented fares and plates.",[("finding-cancelled","Driver cancels","Clear status and a next step"),("help-ticket","Help ticket","A dispute route with a reply time"),("receipt-asbooked","As booked","Receipt matches the fixed fare")]))
B.append(board(10,head("THREE LANGUAGES","English, Sinhala and <em>Tamil</em>","The same screens in the three languages riders use in Sri Lanka.")+f'''<div class="row phones">{ph("ride-treatment",270,"English","Ride options")}{ph("receipt-sinhala",270,"Sinhala","Receipt")}{ph("ride-tamil",270,"Tamil","Ride options")}</div>
<div class="note c"><b>Sinhala and Tamil are machine drafts awaiting native review.</b></div>'''))
cols=[("#FED52F","Yellow","#211F20 ink, 11.5:1","#211F20"),("#211F20","Ink","on yellow 11.5:1","#FED52F"),("#FFF8D6","Soft","ink on soft","#211F20"),("#067647","Ok","on #E3F6EA","#fff"),("#6B4300","Warn","on #FFF1D6","#fff"),("#B42318","Danger","on white","#fff")]
sw="".join(f'<div class="sw" style="background:{c};color:{t}"><b>{n}</b><span class="mono">{c}</span><small>{d}</small></div>' for c,n,d,t in cols)
B.append(board(11,head("DESIGN SYSTEM","Small, flat and <em>accessible</em>")+f'''
<div class="swatches">{sw}</div>
<div class="grid2 ds">
<div class="card"><h3>Type · Manrope</h3><div class="ts"><span style="font-size:34px;font-weight:800">34 Headline</span><span style="font-size:22px;font-weight:700">22 Title</span><span style="font-size:17px;font-weight:600">17 Body strong</span><span style="font-size:15px">15 Body</span><span style="font-size:13px;color:#A8A8AD">13 Caption</span></div></div>
<div class="card"><h3>Components</h3><div class="comps"><div class="c1">Fixed-fare row</div><div class="c2">Ride row</div><div class="c3"><span class="on">Control</span><span>Treatment</span></div><div class="c4">Sheet</div><div class="c5">Pill</div></div></div></div>
<div class="card acc"><h3>Accessibility</h3><ul class="cols"><li>WCAG 2.2 AA</li><li>44px touch targets</li><li>Reduced motion respected</li><li>0 axe violations across the route × variant × language matrix</li><li>Keyboard-only flows</li></ul></div>'''))
B.append(board(12,head("TESTING PLAN & NEXT STEPS","How it would be <em>tested</em>")+'''
<div class="grid2">
<div class="card"><h3>Primary metric</h3><p>Intent-to-treat: share of all assigned riders who complete a second ride within 14 days of their first fare view.</p><h3>Guardrails</h3><p>Driver acceptance, driver earnings per hour, cancellations, unresolved support.</p></div>
<div class="card"><h3>Planning case</h3><p>15% baseline and a 3 point lift needs about <b class="y">2,403 riders per arm</b>. Both numbers are assumptions.</p><h3>Driver economics</h3><p>A fixed fare shifts who absorbs variance. The plan states who pays for each change, and it is to be agreed before any test.</p></div></div>
<div class="card wide"><h3>Next steps</h3><ul class="cols"><li>Clean-device teardown</li><li>5 rider interviews</li><li>Usability test</li><li>Native review of Sinhala and Tamil</li></ul></div>
<div class="links"><div><span class="mono">LIVE PROTOTYPE</span>susithd.github.io/pickme-first-session</div><div><span class="mono">GITHUB</span>github.com/SusithD/pickme-first-session</div><div><span class="mono">PORTFOLIO</span>susith.theqexle.site</div></div>'''))
css=open("style.css").read()
thumb=f'<div id="thumb"><div class="tl"><span class="pill">UI/UX CASE STUDY</span><h1>A first ride you can <em>trust</em></h1></div><div class="tp">{ph("welcome-treatment",205)}{ph("ride-treatment",205)}{ph("receipt-delta",205)}</div></div>'
open("boards.html","w").write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>PickMe first session boards</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet"><style>{css}</style></head><body>{"".join(B)}{thumb}</body></html>')
