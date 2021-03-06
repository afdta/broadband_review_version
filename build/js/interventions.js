//import add_hand_icons from './add_hand_icons.js';

export default function interventions(){
	var I = {};

	//lists of policy ids
	var federal = ["costs","fiveg","stopgaps","alliances","data","research"];
	var local = ["levers","priorities","collaborate","localneeds","regionalism"];
	
	//policy text -- paragraphs separated by {p}
	var policy = {};

	//footnotes in same order as {f}s in the text
	var footnotes = {};

	//split by footnotes first, then by paragraphs

	policy.costs = 'Adopt policies to reduce deployment costs.{p}Today, high-speed wireline service remains the most dependable way to get people connected to the digital economy. For the foreseeable future, then, it will still be vital to get more Americans subscribed to in-home broadband connections. To do so in an era of limited resources, Congress and executive agencies should give immediate attention to reducing deployment costs. One promising way to do so—if politics and industry can align on implementation—is through "dig once" policies, which allow for installing conduit or fiber optic cables during any right-of-way construction project (e.g., road construction).{f} Similar debates and alignment will need to take place regarding pole attachments and the potential for "one touch make ready" policies, which simplify the steps needed to create a new attachment on poles that may already be in use by other telecommunications or cable providers. For example, a one touch make ready policy might direct pole users to come together and select a common contractor for adjusting attachments as needed, rather than sending separate crews for each provider.{f}';

	footnotes.costs = ['For a primer on the "dig once" congressional state of play at time of publication, see Jon Brodkin, <a href="https://arstechnica.com/information-technology/2017/03/nationwide-fiber-proposed-law-could-add-broadband-to-road-projects/" target="_blank">\'Dig Once\' Bill Could Bring Fiber Internet to Much of the US"</a>, Ars Technica, March 22, 2017.', 
	'For a supportive description of "one touch make ready" policy, see Next Century Cities, <a href="http://nextcenturycities.org/2017/02/01/one-touch-make-ready-fact-sheet/" target="_blank">"One Touch Make Ready Fact Sheet"</a>, 2017; or Jon Brodkin, "Verizon Supports Controversial Rule That Could Help Google Fiber Expand," Ars Technica, June 16, 2017. However, some established internet service providers have sued over initial ordinances in Louisville, Ky. and Nashville, Tenn. See, e.g., Blair Levin, "Next Battlefield in the Game of Gigs: Cities and Polls" (Washington: Brookings Institution, 2016).'];

	policy.fiveg = 'Consider the role of evolving wireless technology and business practices.{p}Congress and the FCC must continue to craft policy and market interventions for the 12.7 million rural residents without broadband service, including many residents on tribal lands. The Connect America Fund will continue to make vital investments to advance availability for these households, but leaders should both consider the potential for future satellite technology to reduce public investment needs and actively review whether the quality of current Connect America Fund wireline investments will meet rural recipients\' long-term needs.{p}At the same time, policy leaders should consider how the build-out of new wireless networks—including proposed fifth-generation standards (5G)—and unlimited data plans within current networks will impact unserved populations in both rural and metropolitan communities.{p}Through small cell technology, 5G promises to offer wireless service to large geographic areas at speeds significantly faster than current networks. 5G will still require a wired backbone to connect the small cell transmission points, but it could eliminate the need for wired connections to each home.{f} However, questions remain whether in-home consumers would make the switch, and dependability relative to current wired offerings will be a major sticking point. Given that state and local decisions will determine how such policies are rolled out and where small cell transmission points will be located, local political dynamics and competing agendas could conceivably stymie efforts to close the digital divide through 5G deployment. There is a real opportunity for federal policy to create consistent guidelines for local governments and private firms, but those must both protect digital equality and local governments\' independence.{p}Likewise, unlimited data plans using current 4G LTE networks already enable many individuals to access broadband speeds in neighborhoods underserved by wireline. However, these services will only unlock broad-based economic benefits if all individuals can afford the service and if they connect to more productive devices, specifically desktops and laptops. Since lower-income individuals own computing devices and subscribe to wireless data plans at lower rates, these service improvements will not necessarily reach the entire population. Congressional and agency officials should debate whether other complementary programs, including device or service vouchers, are worthwhile complements to service changes by private wireless service providers.';
	footnotes.fiveg = ['At the time of publication, there is still no current established standard for fifth-generation wireless networks.'];

	policy.stopgaps = 'Move beyond stopgaps and pilots to more sustained adoption-focused funding streams and programming.{p}Broadband Technology Opportunities Program (BTOP) grants from the National Telecommunications and Information Administration (NTIA) enabled recipients to support adoption via outreach and training, but that program was funded only temporarily under the American Recovery and Reinvestment Act of 2010.{f} The Obama administration\'s ConnectHome initiative targeted adoption among low-income families with school-age children living in public housing, but the effort was only an unfunded pilot.{f} And, as noted above, the FCC and NTIA do not formalize adoption objectives within their strategic plans.{f} The only sustained direct support to individuals is the Lifeline program, which the FCC recently expanded to offer direct broadband pricing support.{f}{p}Moving forward, Congress must work with the FCC, the NTIA, and other relevant agencies to establish sustained adoption-focused programs. That should include targeted pricing support where possible, both for monthly service like the FCC Lifeline program and potential purchase credits for equipment. Ideally, targeting support to low-income families with school-age children could ensure those families bring the digital classroom home. Similarly important are sustained support for training programs and capacity support in low-adoption communities. While the Broadband Opportunity Council has ended, the Broadband Interagency Working Group now meets in its place, with the goal of improving coordination among federal partners and programs, reducing regulatory hurdles that impede deployment, and raising awareness of available federal resources at the community-level.{f} In addition, NTIA\'s BroadbandUSA Connectivity Assessment Tool provides a set of tools, resources, and technical assistance to support communities as they work to advance local broadband availability and adoption policies. The evolution and sustainability of this resource is contingent on continued funding from the current administration.{f} The federal government can also help scale successful interventions by assembling and distributing local best practices, a recommendation echoed by the Information Technology and Innovation Foundation.{f} Regularly updating NTIA\'s Adoption Toolkit, first published in 2013, is one possible approach, and one that would also require sustained funding.{f}';

	footnotes.stopgaps = ['For the most recent information regarding the BTOP program, see the <a href="https://www.ntia.doc.gov/category/broadband-technology-opportunities-program" target="_blank">quarterly progress reports.',
	'The White House\'s ConnectHome fact sheet can be found <a href="https://obamawhitehouse.archives.gov/the-press-office/2015/07/15/fact-sheet-connecthome-coming-together-ensure-digital-opportunity-all" target="_blank">here</>.',
	'Government Accountability Office (GAO), "Intended Outcomes and Effectiveness of Efforts to Address Adoption Barriers Are Unclear," GAO-15-473, 2015. Note that NTIA\'s position in response to the GAO report is that, because its technical assistance role to communities is purely advisory, an outcome-based adoption metric would not be appropriate.',
	'For the full library of Lifeline-related information, see <a href="https://www.fcc.gov/general/lifeline-program-low-income-consumers" target="_blank">https://www.fcc.gov/general/lifeline-program-low-income-consumers</a>.',
	'The Broadband Opportunity Council\'s website is <a href="https://www.ntia.doc.gov/category/broadband-opportunity-council" target="_blank">https://www.ntia.doc.gov/category/broadband-opportunity-council</a>; the Broadband Interagency Working Group\'s website is <a href="https://www.ntia.doc.gov/category/broadband-interagency-working-group" target="_blank">https://www.ntia.doc.gov/category/broadband-interagency-working-group</a>.',
	'The BroadbandUSA Connectivity Assessment Tool can be found at <a href="http://www2.ntia.doc.gov/CCI" target="_blank">http://www2.ntia.doc.gov/CCI</a>.',
	'Doug Brake and Robert D. Atkinson, "Comments of the Information Technology and Innovation Foundation in the Matter of Broadband Opportunity Council Request for Comment" (Washington: Information Technology and Innovation Foundation, 2015).',
	'National Telecommunications and Information Administration (NTIA), "NTIA Broadband Adoption Toolkit,"" 2013.'
	];

	policy.alliances = 'Forge metropolitan/rural alliances on Capitol Hill.{p}Considering geographic differences and aggregate funding needs, Congress will likely need to strike a grand bargain between those representing more metropolitan constituents and those representing primarily rural areas. Since each group has clear needs, there is room for a balanced approach. In particular, there is an opportunity for legislators to reform current public revenue streams to simultaneously fund availability and adoption programs and remove those programs from annual appropriations\' fights.';
	footnotes.alliances = [];

	policy.data = 'Leverage public data more effectively.{p}The federal government can do more around data. The geographic granularity of the FCC\'s availability and adoption data is excellent. However, the use of quintiles to report wireline adoption levels limits accuracy of analysis. The FCC should have an open debate about publicly releasing granular wireline neighborhood-level adoption rates, allowing researchers controlled access, and producing companion adoption statistics within the "Measuring Broadband America" report series.{f} Adding pricing and speed information within the availability data would help researchers and consumers alike, although this step introduces complexities due to internet-service bundling.{f} In both cases, however, it is clear that local leaders could use more accurate broadband data to better target their policy interventions. Likewise, the continued emergence of wireless data subscriptions demands improved data releases and followup research. If wireless becomes a more preferred option for in-home data, the FCC and independent researchers will have performance data to understand why.{f}';
	footnotes.data = ['FCC, "2016 Measuring Broadband America Fixed Broadband Report," 2016.',
	'For more information about broadband performance and consumer-facing transparency, see Emily Hong and Sarah Morris, "Getting Up to Speed: Best Practices for Measuring Broadband Performance" (Washington: New America Foundation, 2016).',
	'For current research on in-home use of wireless broadband subscriptions, see Giulia McHenry, <a href="https://www.ntia.doc.gov/blog/2016/evolving-technologies-change-nature-internet-use" target="_blank">"Evolving Technologies Change the Nature of Internet Use"</a> (Washington: NTIA, 2016).'
	];

	policy.research = 'Support further research efforts, including around technology, competition, and ownership.{p}Broadband is an essential service, but a relatively new technology. There are many opportunities for research to expand the public\'s understanding of how the broadband marketplace works and what the federal role could and should be. Fully funding research efforts like the National Science Foundation\'s Advanced Wireless Initiative will be key to ensuring the United States stays at the digital telecommunications forefront.{f}{p}Another debate that looms large in this arena is what role competition does or should play in the provision of in-home broadband, both in terms of investment needed for deployment and in reaching optimal price points. Likewise, the emergence of state laws to block public ownership of broadband networks merits further national research, especially if such state laws are found to block ownership schemes that could improve economic opportunity.';

	footnotes.research = ['For more information on the Advanced Wireless Initiative, visit the <a href="https://nsf.gov/cise/advancedwireless/" target="_blank">National Science Foundation website</a>.'];

	policy.levers = 'Communities should use the levers they control to influence broadband availability.{p}Franchise agreements are a traditional way to influence a cable company\'s broadband deployments in a given jurisdiction, but there are many more options to improve infrastructure extent and quality. In states where the law does not preempt local authority, competitiveness levers include establishing public or cooperative broadband providers, streamlining permitting for new entrants, and constructing public conduit that is available to all providers (or incentivizing private operators to do the same). Urban communities big and small could use targeted subsidies to incentivize deployments in specific neighborhoods, with one idea being Gigabit Opportunity Zones introduced by FCC then-Commissioner Ajit Pai.{f} The major challenge around deployment will continue to be the natural tensions between the public sector, whose mission is to maximize public utility for all, and private broadband providers, who are responsible for delivering profit to their shareholders.';

	footnotes.levers = ['FCC, <a href="https://apps.fcc.gov/edocs_public/attachmatch/DOC-341210A2.pdf" target="_blank">"Summary of FCC Commissioner Ajit Pai\'s Digital Empowerment Agenda,"</a> 2016.'];

	policy.priorities = 'Collect and reflect on data to inform local priorities.{p}National surveys of broadband availability and adoption do an excellent job conveying the full extent of broadband challenges, but they\'re often too aggregated to help design specific policy reforms. Given that broadband adoption is ultimately a household-by-household decision, blanket policies may not maximize impact. Effectively addressing the digital divide requires that policymakers, service providers, and advocates understand how policies and resources "go to ground" at the local level, and align federal, state, and local interventions accordingly.{p}For instance, a number of issues, such as pricing, can influence in-home adoption rates. The Pew Research Center\'s most recent home broadband report finds that cost—both in terms of a subscription and computing equipment—is the primary reason 43 percent of survey respondents did not adopt in-home broadband.{f} Stakeholder interviews by the Government Accountability Office (GAO) confirmed similar issues with affordability.{f} At an even more fundamental level, GAO interviews and NTIA research finds that many Americans continue to question the relevance of the internet or perceive it as unsafe.{f} Even for those with the financial means and understanding of broadband\'s benefits, a lack of digital literacy may impede adoption.{f}{p}While neighborhood-level performance indicators like those in this paper are a first-order requirement to benchmark local need, to fully understand the factors underlying the outcomes presented here public officials should go a step further and survey their neighborhoods on local conditions and attitudes related to broadband. For example, the City of Seattle runs a technology access and adoption survey every four years under its Digital Equity Initiative; the survey includes both demographic details and specific broadband performance measures.{f} The Minnesota Office of Broadband Development puts out annual reports on the state\'s availability and adoption progress.{f} Such surveys are especially important in rural communities, where bridging availability gaps may be expensive and should require clear articulation of bandwidth needs based on local economic activity.';

	footnotes.priorities = ['John Horrigan and Maeve Duggan, "Home Broadband 2015" (Washington: Pew Research Center, 2015).',
	'Government Accountability Office (GAO), "Intended Outcomes and Effectiveness of Efforts to Address Adoption Barriers Are Unclear,"" GAO-15-473, 2015.',
	'GAO 2015; National Telecommunications and Information Administration (NTIA), "NTIA Broadband Adoption Toolkit," 2013.',
	'NTIA defines digital literacy as "the ability to use information and communication technologies to find, evaluate, create, and communicate information; it requires both technical and cognitive skills"; NTIA 2013, or see <a href="https://www2.ntia.doc.gov/resources" target="_blank">https://www2.ntia.doc.gov/resources</a>.',
	'City of Seattle, "Information Technology Access and Adoption in Seattle: Progress Towards Digital Opportunity and Equity," 2014.',
	'Minnesota Office of Broadband Development, "Governor\'s Task Force on Broadband–2016 Annual Report," 2016.'
	];

	policy.collaborate = 'Collaborate to drive adoption improvements.{p}Addressing multiple adoption barriers at the same time is vital, but it will not be cheap. Educators in community centers of all kinds will need to teach skeptical households and those struggling with digital literacy. Equipment will need to be bought, both to outfit community centers and to directly support individuals. Likewise, fully funded marketing campaigns (described in more detail below) are critical to reach the right people in the right neighborhoods. Orchestrating these complementary but separate efforts will require management staff inside and outside government, who must be paid. Government can certainly play a role in all this, but efforts at this scale will also require coordination with the private sector and civic institutions that have much to gain. One successful model is DigitalC, a Cleveland civic organization that collaborates directly with public agencies and private firms to close the digital divide. For example, DigitalC worked alongside the Cuyahoga Metropolitan Housing Authority to bring broadband service, computing equipment, and training to public housing units and their residents.{f}';

	footnotes.collaborate = ['Marcia Pledger, "First High-Speed Broadband in Cleveland\'s Public Housing Celebrated Today," <em>Cleveland Plain Dealer</em>, May 11, 2017.'];

	policy.localneeds = 'Develop campaigns tailored to local needs.{p}Governmental, nonprofit, and academic research consistently finds public outreach and training programs to be an important strategy to boost broadband adoption. Doing so effectively will require a layered approach, including digital curricula in primary schools, classes and free internet access at community institutions like libraries, and branded marketing campaigns to expand reach to target populations.{f} In some places, effective outreach may require equipment subsidies and discounts. Especially promising is a compelling case made by staff at the Federal Reserve Bank of Dallas: engaging financial institutions to support broadband investments in low- and moderate-income communities via the Community Reinvestment Act.{f} Marketing campaigns are especially important as it relates to attitudes around wireless broadband subscriptions relative to wireline. Many tech-savvy Pacific markets demonstrate lower wireline subscription rates when compared to broader subscription statistics from other sources, like those from the American Community Survey that simultaneously measure wireless and wireline. Tailored campaigns in markets like those may seek to understand why wireless rates may be higher and what other factors—such as ease of use, pricing, or even widespread availability of free WiFi—may impact wireless versus wireline subscription rates.';

	footnotes.localneeds = ['Jessica A. Lee and Adie Tomer, "Building and Advancing Digital Skills to Support Seattle\'s Economic Future" (Washington: Brookings Institution, 2015).',
	'Jordana Barton, "Closing the Digital Divide: A Framework for Meeting CRA Obligations" (Federal Reserve Bank of Dallas, 2016).'
	];

	policy.regionalism = 'Think locally, act regionally{p}Finally, how communities navigate jurisdictional boundaries will determine how effectively and efficiently they are able to close their availability and adoption gaps. Subpar broadband adoption in a handful of neighborhoods can limit an entire region\'s ability to grow its economy or switch to digital government platforms. As such, digital skills campaigns cannot just be core city programming—they should have extensive regional reach.  NTIA\'s Adoption Toolkit touches on many of these approaches and includes applied examples from across the country.{f}';

	footnotes.regionalism = ['National Telecommunications and Information Administration (NTIA), "NTIA Broadband Adoption Toolkit," 2013.'];

	//parse
	var policy2 = {};
	for(var p in policy){
		if(policy.hasOwnProperty(p)){
			var split0 = policy[p].split("{f}");

			var footnoted = "";
			split0.forEach(function(d,i){
				//don't footnote the last substring. if last character is footnote, then the last element in the array will be blank string, ""
				var super_note = (i < (split0.length-1)) ? "<sup>" + (i+1) + "</sup>" : "";
				footnoted = footnoted + d + super_note;
			}); 
			policy2[p] = footnoted.split("{p}");
		}
	}

	var body_wrap = d3.select("#metro-interactive");
	var show = function(id){
		d3.event.stopPropagation();
		var fixed = body_wrap.append("div")
			.style("position","fixed")
			.style("width","100%")
			.style("height","100%")
			.style("z-index","1000")
			.style("background-color","rgba(0, 0, 0, 0)")
			.style("top","0px")
			.style("left","0px")
			.classed("makesans",true)
			;

		var table = fixed.append("div")
			.style("display","table")
			.style("max-width","1000px")
			.style("width","90%")
			.style("height","100%")
			.style("margin","1em auto")
			.style("opacity","0");
		var row = table.append("div")
			.style("display","table-row");
		var cell = row.append("div")
			.style("display","table-cell")
			.style("vertical-align","middle")
			;

		var box_wrap = cell.append("div")
			.style("border","0px solid #ffffff")
			.style("padding","0px")
			.style("position","relative")
			.style("display","block")
			;

		var ribbon_cols = ["#0d73d6"];
		var svg_ribbon = box_wrap.append("div")
								 .style("height","10px")
								 .append("svg").attr("width","100%")
								 .attr("height","100%")
								 .style("x","0px")
								 .style("y","0px")
								.style("display","block")
								.selectAll("rect").data(ribbon_cols).enter()
								.append("rect").attr("width",(100/(ribbon_cols.length))+"%")
								.attr("height","100%").attr("x", function(d,i){return (i*(100/7))+"%"})
								.attr("fill", function(d,i){
									return ribbon_cols[i];
								});


		var x_height = 30;
		var x_width = x_height;

		var xsvg = box_wrap.append("div")
		   .style("cursor","pointer")
		   .classed("make-sans",true)
		   .style("position","absolute")
		   //.style("top","-"+(x_height+5)+"px")
		   .style("top",(x_width)+"px")
		   .style("right",x_width+"px")
		   .style("width",x_width+"px")
		   .style("height",x_height+"px")
		   .style("z-index","10")
		   .append("svg")
		   .attr("width","100%").attr("height","100%")
		   ;

			xsvg.append("line").attr("x1","20%").attr("x2","80%").attr("y1","20%").attr("y2","80%");
			xsvg.append("line").attr("x1","20%").attr("x2","80%").attr("y1","80%").attr("y2","20%");

			xsvg.selectAll("line").attr("stroke","#0d73d6")
									.attr("stroke-width","5px");
		   ;

		var box = box_wrap.append("div").classed("makesans reading",true)
			.style("background-color","rgba(250, 250, 250, 1)")
			.style("position","relative")
			.style("padding","1rem")
			.style("line-height","1.4em")
			.style("overflow","auto")
			.style("max-height","85vh")
			.style("max-width","1000px")
			.style("z-index","5")
			;


			box.selectAll("p").data(policy2[id]).enter().append("p")
						.html(function(d){return d})
						.style("padding",function(d,i){
							return i==0 ? "0.5rem " + (x_width+20)+"px" + " 0rem 1rem" : "0rem 1rem 0rem 1rem";
						})
						.style("margin","1rem 0em 1.75rem 0em")
						.style("font-weight",function(d,i){return i==0 ? "bold" : "normal"})
						.style("font-size",function(d,i){return i==0 ? "1.5em" : null})
						//.style("font-size", function(d,i){return i==0} ? "1.5em" : "1em")
						;

		if(footnotes[id].length > 0){
			box.append("div").style("height","0.5em").style("width","30%")
				  .style("border-top","1px solid #aaaaaa")
				  .style("margin","0px 0px 0px 0.75rem");
			var footnote_wrap = box.append("div").style("margin","1rem");
			var footnote_text = footnote_wrap.selectAll("p").data(function(d){return footnotes[id] }).enter().append("p")
											.html(function(d,i){
												var super_note = "<sup>" + (i+1) + "</sup> ";
												return super_note + d;
											});
		}

		//show
		fixed.transition()
			.style("background-color","rgba(0, 0, 0, 0.75)")
			;
		table.transition().style("opacity","1");		

		box.on("mousedown", function(d,i){
			d3.event.stopPropagation();
		})

		fixed.on("mousedown", function(d,i){
			fixed.remove();
		});
		//
	}//end show


	//use 1: layout all the interventions in a large grid with text
	I.grid = function(container, local_policy){
		var wrap = d3.select(container).style("max-width","1600px").style("margin","0px auto");

		var data = arguments.length > 1 && !!local_policy ? local.map(function(d){return {id:d, text:policy2[d]}}) : 
															federal.map(function(d){return {id:d, text:policy2[d]}}); 

		var row = wrap.selectAll("div").data([data])
							.enter().append("div")
							.classed("c-fix",true)
							.style("margin","0em 0em")
							;

		var tiles = row.selectAll("div.subway-tile").data(function(d){return d})
							.enter().append("div").classed("subway-tile",true);

		var headers = tiles.append("div").classed("tile-header",true);
		var dots = headers.append("div").classed("dot",true);
		//var dot_labels = dots.append("p").text(function(d){return d});


		var content = tiles.append("div").classed("tile-content reading",true);
		var text = content.selectAll("p").data(function(d){return d.text}).enter().append("p")
							.html(function(d){return d})
							.style("font-weight",function(d,i){return i==0 ? "bold" : "normal"})
							.style("font-size",function(d,i){return i==0 ? "1.15em" : null})
							;
		;

		content.each(function(d,i){
			var thiz = d3.select(this);
			if(footnotes[d.id].length > 0){
				thiz.append("div").style("height","0.5em").style("width","30%")
								  .style("border-top","1px solid #aaaaaa")
								  ;

				var footnote_wrap = thiz.append("div");
				var footnote_text = footnote_wrap.selectAll("p").data(function(d){return footnotes[d.id] }).enter().append("p")
												.html(function(d,i){
													var super_note = "<sup>" + (i+1) + "</sup> ";
													return super_note + d;
												});
			}
		});

		//more info available...

		tiles.append("div").classed("more-info-available",true);

		var expandable = {};
		var sizeCheck = function(){

			content.each(function(d,i){
				var bottom0 = this.parentNode.getBoundingClientRect().bottom;
				var bottom1 = this.getBoundingClientRect().bottom;
				expandable[(i+"")] = bottom1 > bottom0;
			});

			tiles.classed("click-for-more-info", function(d,i){
					if(expandable[(i+"")]){
						return true;
					}
					else{
						return false;
					}				
				});
			
			var uup = tiles.selectAll("div.zoomdiv").data(function(d,i){
				return expandable[(i+"")] ? [1] : [];
			});
			uup.exit().remove();
			var uen = uup.enter().append("div").classed("zoomdiv",true);
				uen.append("svg")
				uen.style("position","absolute")
					  .style("bottom","2em")
					  .style("right","3em")
					  .style("width","50px")
					  .style("height","50px")
					  .style("padding","0px")
					  .style("border","0px solid #0d73d6")
					  .style("background-color","rgba(255,255,255,0.8)")
					  .style("border-radius","25px")
					  ;

				var zoom_svg = uen.select("svg").attr("width","50px")
									    .attr("height","50px")
										.attr("viewBox","0 0 50 50");

				var zoom_in_g = zoom_svg.append("g").attr("transform","translate(0,-1030)")
												.attr("stroke-linecap","round")
												;	

				//zoom_in_g.append("path").attr("stroke-width","4")
				//			.attr("d", "m23.282 1070.1 7.3299 7.3299m-6.0819-15.665c-0.000012 4.979-4.0363 9.0152-9.0152 9.0152-4.979 0-9.0152-4.0362-9.0152-9.0152 0.0000119-4.979 4.0363-9.0152 9.0152-9.0152 4.979 0 9.0152 4.0362 9.0152 9.0152z");
				//zoom_in_g.append("path").attr("stroke-width","2")
				//			.attr("d", "m10.856 1061.7h9.0873m-4.5437-4.5436v9.0873");

				zoom_in_g.append("path").attr("d","m42.5 1055a17.5 17.5 0 0 1 -17.5 17.5 17.5 17.5 0 0 1 -17.5 -17.5 17.5 17.5 0 0 1 17.5 -17.5 17.5 17.5 0 0 1 17.5 17.5z").attr("fill","#0d73d6");
				zoom_in_g.append("path").attr("d","m19 1054.5 6.1902 6 5.8098-6")
										.attr("stroke","#ffffff").attr("stroke-linecap","square").attr("fill","none").attr("stroke-width","5")
										.attr("stroke-linejoin","round");


		}

		tiles.on("mousedown", function(d,i){
			if(expandable[(i+"")]){
				show(d.id);
			}
		});

		sizeCheck();

		window.addEventListener("resize", sizeCheck);


	}

	//unused here -- useful when you want a quick list of buttons
	I.grid_small = function(container, supercluster, text_color){
		var outer_wrap = d3.select(container);

		var col = arguments.length > 2 ? text_color : "#333333";

		outer_wrap.select("div.subway-tile-small-grid").remove();	

		var wrap = outer_wrap.append("div").classed("c-fix subway-tile-small-grid",true).style("padding-left","0px");	

		var text_wrap = wrap.append("div").classed("c-fix",true);
			text_wrap.append("p").text("Effective practices for this group")
						.style("float","left").style("margin","0em 1em 0em 0")
						.style("padding","0px 10px 0em 10px")
						.append("span")
						.style("margin-left","6px")
						.classed("hand-icon",true)
						;


		add_hand_icons(container);


		var rows = wrap.selectAll("div.intervention-row").data([descriptions.initials.slice(0)]) //,descriptions.initials.slice(4)])
							.enter().append("div").classed("c-fix intervention-row",true).style("margin","0.75em 0em 0.5em 0px")
							.style("float","left")
							;
								
							
		var dots = rows.selectAll("div.subway-tile-dot").data(function(d){return d})
							.enter().append("div").classed("subway-tile-dot",true).style("float","left")
							.style("margin","0em 0.175em 0.35em 0.175em")
							.style("cursor",function(d){
								return true;
								//return turn_on.hasOwnProperty(d) ? "pointer" : "auto";
							})
							.style("background-color", function(d){
								return "orange";
								//if(turn_on.hasOwnProperty(d)){
								//	return text_color;
								//}
								//else{
								//	return "#dddddd";
								//}
							})
							;

		dots.on("mousedown", function(d){
			//if(turn_on.hasOwnProperty(d)){
				show(d.id);
			//};
		});

		dots.append("p").text(function(d){return d})
							.style("color", function(d){
								return "#ffffff";
							});	

		var timer;
		var hover_text = wrap.append("p")
			.style("margin","0em 0em 0em 10px").style("font-size","1em")
			.style("font-style","italic")
			.style("clear","both")
			.html("&nbsp;")
			;

		dots.on("mouseenter", function(d){
			clearTimeout(timer);
			hover_text.text(descriptions.titles[d]).transition().duration(0).style("opacity",1);
		})	
		dots.on("mouseleave", function(d){
			timer = setTimeout(function(){
				hover_text.html("&nbsp;").transition().duration(400).style("opacity","0");
			},150);
		})	

	}

	return I;
}
