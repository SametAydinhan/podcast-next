import { GeneratePodcastProps } from "@/types";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { v4 as uuidv4, v4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/hooks/use-toast";

const useGeneratePodcast = (props: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.podcasts.getUrl);
  // logic for podcast generation
  const generatePodcast = async () => {
    setIsGenerating(true);
    // call the API to generate the podcast
    props.setAudio("");
    if (!props.voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate the podcast",
      });
      return setIsGenerating(false);
    }
    try {
      const response = await getPodcastAudio({
        input: props.voicePrompt,
        voice: props.voiceType,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      props.setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storeageId: storageId });
      props.setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (e) {
      console.log("Error generating podcast", e);
      toast({
        title: "Error generating podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
    setIsGenerating(false);
  };
  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  return (
    <div>
      <div className='flex flex-col gap-2.5'>
        <Label className='text-16 font-bold text-white-1'>
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className='input-class font-light text-white focus-visible:ring-offset-orange-1'
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className='mt-5 w-full max-w-[200px]'>
        <Button
          type='submit'
          className='text-16 bg-orange-1 py-4 font-bold text-white-1'
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className='animate-spin ml-2' />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className='mt-5'
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
