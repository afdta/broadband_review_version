#test of gifs
library("maptools")
library("tidyverse")
library("broom")
library("rgdal")
library("metromonitor")
library("gganimate")
library("tweenr")

data <- read_csv("/home/alec/Projects/Brookings/broadband/build/data/Masterfile.txt")
data$atl3 <- substring(data$atl3,1,1)
data$atl10 <- substring(data$atl10,1,1)
data$atl25 <- substring(data$atl25,1,1)
data$above1g <- substring(data$above1g,1,1)
data$pov <- data$inpov/data$povuniv
data$ba <- data$baplus_1115/data$edattain_univ_1115
data$ki <- data$u18_1115/data$pop_1115
data$access <- ifelse(data$atl25=="N", 0, 1)
data$sub <- factor(ifelse(data$pcat_10x1==0, 1, data$pcat_10x1), levels=1:5, labels=c("0-20  ","20-40  ","40-60  ","60-80  ","80-100  "))

DTA <- data[c("cbsa","tract","atl25","sub","ba","pov","ki")]
names(DTA) <- c("cbsa","tr","av","sub","ba","pov","ki")

colors <-c('#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594')

cutname <- function(cut){
  fl <- floor(cut)
  ce <- ceiling(cut)
  #retain old title until 25% of the way toward next state
  if((cut-fl) < 0.25){
    cut <- fl
  } else{
    cut <- ce
  }
  
  if(cut==1){
    name <- "All neighborhoods"
  } else if(cut==2){
    name <- "Neighborhoods without broadband availability"
  } else if(cut==3){
    name <- "Neighborhoods with 20%+ poverty rates"
  } else if(cut==4){
    name <- "Neighborhoods with above U.S. average BA attainment"
  } else if(cut==5){
    name <- "Neighborhoods with above U.S. average shares of children"
  } else{
    name <- ""
  }
  return(name)
}

draw <- function(cbsa_code, title, lnwidth=0.25, folder="~/Desktop/ggsave", numframes=5){
  shp <- readOGR("/home/alec/Projects/Brookings/js-modules/maps/build/data/geo/tract/2014/shp", cbsa_code)
  cbsa_code <- as.integer(cbsa_code)
 
   #create directory
  if(dir.exists(folder)){
    unlink(folder, recursive=TRUE)
    dir.create(folder)
  } else{
    dir.create(folder)
  }
  
  pov <- as.data.frame(DTA %>% filter(cbsa==cbsa_code) %>% mutate(alpha = ifelse(pov < 0.2 | is.na(pov), 0, 1)))
  avail <- as.data.frame(DTA %>% filter(cbsa==cbsa_code) %>% mutate(alpha = ifelse(av!="N" | is.na(av), 0, 1)))
  ba <- as.data.frame(DTA %>% filter(cbsa==cbsa_code) %>% mutate(alpha = ifelse(ba <= 0.2977 | is.na(ba), 0, 1)))
  ki <- as.data.frame(DTA %>% filter(cbsa==cbsa_code) %>% mutate(alpha = ifelse(ki <= 0.2328 | is.na(ki), 0, 1)))  
  all <- as.data.frame(DTA %>% filter(cbsa==cbsa_code) %>% mutate(alpha = 1))
  
  all$cut <- 1
  avail$cut <- 2
  pov$cut <- 3
  ba$cut <- 4
  ki$cut <- 5
  
  allall <- rbind(all, avail, pov, ba, ki)
  allall$ease <- "cubic-in-out"
  
  if(numframes > 2){
    nframes <- (numframes-2)*24
  } else{
    nframes <- 24
  }
  
  tweened <- tween_elements(allall[c("cut","tr","ease","alpha")], time="cut", group="tr", ease="ease", nframes=nframes)

  fort <- tidy(shp, region="geo_id")
  
  fort2 <- merge(merge(fort, tweened, by.x="id", by.y=".group"), DTA[c("tr","sub")], by.x="id", by.y="tr")
  fort2 <- fort2[order(fort2$.frame, fort2$order), ]
  
  cat("Nrows in fortified data frame: ")
  cat(nrow(fort))
  cat("\n")
  cat("Nrows in final: ")
  cat(nrow(fort2))
  cat(" (")
  cat(nrow(fort2)/nrow(fort))
  cat("X obs)\n")
  
  actframes <- max(fort2$.frame)
  cat("Actual number of frames: ")
  cat(actframes)
  cat("\n")
  
  command = "convert -layers OptimizeFrame "
  undelay = TRUE
  
  for(i in 0:actframes){
    subsetted <- fort2 %>% filter(.frame==i)
    
    if(subsetted[1,"cut"] - floor(subsetted[1,"cut"]) == 0){
        command <- paste0(command, "-delay 200 img",i,".png ")
        undelay <- TRUE
    } else if(undelay){
        command <- paste0(command, "-delay 4 img",i,".png ")
        undelay <- FALSE
    } else{
        command <- paste0(command, "img",i,".png ")
    }
    subtitle <- cutname(subsetted[1,"cut"])
    gg <- ggplot(subsetted) + geom_polygon(aes(x=long, y=lat, group=id, alpha=alpha, fill=sub), color="#d0d0d0", size=lnwidth) + 
                          scale_fill_manual(values=colors, limits=c("0-20  ","20-40  ","40-60  ","60-80  ","80-100  "), name="Subscription rate (%): ") +
                                                    scale_alpha_identity() +
                                                    ggtitle(title, subtitle) +
                                                    theme(axis.line=element_blank(),
                                                          plot.title = element_text(family = "Arial", color="#111111", face="bold", size=32, hjust=0.5, margin=margin(t=12, b=12, unit="pt")),
                                                          plot.margin = margin(t=12,b=12,unit="pt"),
                                                          plot.subtitle = element_text(family = "Arial", color="#111111", size=26, hjust=0.5),
                                                          axis.text.x=element_blank(),
                                                          axis.text.y=element_blank(),
                                                          axis.ticks=element_blank(),
                                                          axis.title.x=element_blank(),
                                                          axis.title.y=element_blank(),
                                                          legend.position="bottom",
                                                          legend.text = element_text(family = "Arial", color="#111111", size=26, margin=margin(r=22, unit="pt")),
                                                          legend.title = element_text(family = "Arial", color="#111111", size=26),
                                                          legend.box.spacing=unit(0,"pt"), 
                                                          legend.box.margin=margin(t=-12, unit="pt"),
                                                          panel.background=element_blank(),
                                                          panel.border=element_blank(),
                                                          panel.grid.major=element_blank(),
                                                          panel.grid.minor=element_blank(),
                                                          plot.background=element_blank())
    
    ggsave(paste0(folder,"/img",i,".png"), gg, device="png", width=14.23, height=12, dpi=90)
    cat("Frame ")
    cat(i)
    cat("/")
    cat(actframes)
    cat(" processed\n")
  }
  
  command <- paste0(command, cbsa_code, ".gif")
  
  system(paste0("cd ", folder, "; ", command))
  
  cat(command)
  cat("\n")
  
  writeLines(command, con = paste0(folder,"/convert.txt"))
}

#tranche 1
draw("41860", "San Francisco metro area broadband subscription rates")
draw("17460", "Cleveland metro area broadband subscription rates")
draw("41620", "Salt Lake City, Utah metro area broadband subscription rates")
draw("39340", "Provo, Utah metro area broadband subscription rates")
draw("47900", "Washington, DC metro area broadband subscription rates", lnwidth=0.2)
draw("37980", "Philadelphia metro area broadband subscription rates")
draw("35620", "New York metro area broadband subscription rates", lnwidth=0.05)
draw("41740", "San Diego metro area broadband subscription rates")

#tranche 2
draw("14460", "Boston metro area broadband subscription rates")
draw("19820", "Detroit metro area broadband subscription rates")
draw("46520", "Honolulu metro area broadband subscription rates")
draw("12580", "Baltimore metro area broadband subscription rates")
draw("36420", "Oklahoma City metro area broadband subscription rates")
draw("41700", "San Antonio metro area broadband subscription rates")

#animation::ani.options(interval = 1/10)
#gganimate(draw("10420"), "~/Desktop/akron.gif", ani.width=1200, ani.height=1200, title_frame=FALSE, interval=1/15) #akron
#draw("16700") #charleston
#draw("42660") #seattle