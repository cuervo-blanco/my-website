export const dspDictionaryOverview = {
  title: "DSP Dictionary",
  subtitle:
    "Digital audio, DSP, plugins, and systems design explained in practical terms.",
  intro:
    "This page keeps the language informal on purpose. The goal is not to sound academic. The goal is to make the systems underneath the knobs easier to see.",
};

export const dspDictionarySections = [
  {
    id: "digital-audio",
    title: "Digital Audio",
    summary:
      "Digital audio stops feeling mysterious once you accept that, for DSP work, it is a list of values over time.",
    paragraphs: [
      "When I went to film school, I majored in sound design and audio engineering. Certain concepts always felt aloof in their explanation. Primarily because the teachers were audio engineers in the field of film, and not computer engineers. So they explained certain concepts in a very superficial way, which was useful for the work at hand, but not sufficient for a thirsty mind.",
      "For example, when they explained the topic of bit depth, they just said, \"the higher the bit depth, the louder you can record, and the space between the noise floor and your signal is stretched out.\" Sample rate was explained as, \"the higher the sample rate, the smoother the sound wave.\" And at the bare minimum they suggested, \"Always use 24-bit and 48 kHz for your recordings,\" which is the standard. To be fair to my teachers, this was the best way to explain these concepts to a group of film students, who are not necessarily interested in the technical details of digital audio, but rather in the practical applications of it. That left me with an itching curiosity to unravel, and finally understand, that it is not that complicated to explain once you grasp it.",
      "Simply put, bit depth is the number of bits used to represent the amplitude of the audio signal at each sample point. The higher the bit depth, the more precise the representation of the audio signal. For example, with a 16-bit depth, you have 2^16 possible amplitude values, while with a 24-bit depth, you have 2^24 possible amplitude values.",
      "With floating-point representation, you have a much larger range of possible amplitude values, which allows for a much more precise representation of the audio signal. Where 16-bit and 24-bit are fixed-point, meaning the decimal point is fixed in a specific position, and your representation is limited to a certain finite range of values, in floating-point representation the decimal point can \"float\" to accommodate a much wider range of positive and negative values. In practice, normalized audio is often discussed around -1.0 to 1.0, but internal floating-point processing can go beyond that range.",
      "That means that if you overflow a 16-bit or 24-bit representation, you will get clipping and distortion, and there is no turning back from that, because the values are limited to a certain range. Whereas in floating-point representation you can go beyond the normalized range internally without clipping at that stage, and then apply gain reduction later to bring it back down. That is not to say that sending that oversized signal back into a fixed-point output or a DAC will never distort. It means you have more room to work before that final stage.",
      "Digital audio representation is usually displayed as a waveform, showing the amplitude of the audio signal over time. This representation is a point of contention, with many content creators referring to it as inaccurate and instead using a blocked view of the waveform as a more accurate representation. This staircase representation is often used to illustrate the concept of sampling and quantization in digital audio, where the continuous analog signal is represented as discrete steps.",
      "However, this representation has gathered much criticism because it does not take into account the whole process of digitization, particularly the reconstruction phase in the DAC process, which uses interpolation, zero-order hold, and reconstruction filtering to convert discrete samples back to an analog signal. So one side of the argument is that this staircase representation is misleading and does not accurately reflect the complete picture of digital audio, since at the end of the day the musician is listening to a continuous signal. Whereas the other side argues that since sampling is a fundamental part of the analog-to-digital conversion process, the staircase representation is more useful for synthesis and manipulation work.",
      "My understanding is that both representations are exactly that, representations, and that neither of them is an accurate depiction of the actual digital sound wave, but rather a visual tool that can assist you in your DSP work. If anything, the staircase representation is more accurate in the sense that it shows the discrete nature of digital audio, while the smooth waveform can be misleading because it implies a continuous signal. Even though, at the end of the day, in your headphones you are actually listening to a continuous signal that has been reconstructed from the discrete samples, that is not what you work on.",
      "The truth is, digital audio is a list of numbers that represent the amplitude of the sound wave at specific points in time. You want to increase the amplitude by 6 dB, which is roughly double the amplitude? You multiply the numbers by 2. You want to apply a low-pass filter? You convolve the list of numbers with the impulse response of the filter. You want to apply a delay? You shift the list of numbers by a certain amount of samples.",
      "This does not imply that the reconstruction phase is nonexistent or unimportant. However, just as you do not take into account, when performing DSP work, acoustic properties such as the room response, the microphone response, the speaker response, and so on, you also usually do not take into account the reconstruction phase of the DAC process. Not because it is not important, but because it is not relevant to the atomic work you are doing at the precise moment. On a bigger picture, both processes are important.",
      "Particularly if you are constructing a system that analyzes and modifies properties from the real acoustic sound wave, you need to take into account the whole process of digitization, including the reconstruction phase, because it will affect the final sound that the listener hears. Nevertheless, when performing digital tasks and processing, at the end of the day you are still acting on numbers.",
      "One could continue arguing that audio is not a list, but electric pulses. However, I would argue that unless you are a computer engineer at that ultra-low level, which is lower than the level that is useful for most DSP work, this is of no use to the work at hand. Not to say that it is not important to understand, but by focusing on the high-level view of the reality of digital sound you are placing the reality at your level. Or, more accurately, you are taking on someone your own size. And if it makes you feel good, then even the list is an inaccurate representation. But let me know when you can double the amplitude of a digital pulse with the same ease with which you do it in a high-level environment by just multiplying the numbers by 2.",
    ],
  },
];

export const dspDictionaryReferenceIntro = [
  "In my film school, analog was king. Many students preferred the warm and organic sound of analog equipment, and the imperfections that come with it. However, I always found digital audio to be more versatile and precise, and I was always fascinated by the possibilities that it offered once you truly get it.",
  "So I want to use this space to explain as many audio DSP concepts as you would find in any digital audio workstation, using simple words and analogies that will demystify what is going on under the hood. After all, we are audio engineers first who have delved into the DSP world to understand the tools that we use, and to be able to create our own tools in real-world applications such as film production, music production, and game audio. So I want to explain these concepts in a way that is useful for the work at hand.",
];

export const dspDictionaryTopicGroups = [
  {
    title: "Core Operations",
    topics: [
      {
        id: "gain",
        title: "Gain",
        body: [
          "Gain is the process of increasing or decreasing the amplitude of a signal. As I already explained, this is typically achieved by multiplying the signal values by a constant factor. Want to reduce the amplitude by half, about -6 dB? Multiply the signal values by 0.5. Want to increase the amplitude by about 6 dB? Multiply the signal values by 2.",
          "This constant factor has a direct relationship with decibels, which is a logarithmic unit used to measure the ratio of two values. A better way to see it is using the formula: Gain (dB) = 20 * log10(gain factor). So a gain factor of 2 corresponds to about 6 dB, while a gain factor of 0.5 corresponds to about -6 dB.",
          "What two values are meant when we talk about decibels? The input and output signal. So if you have an input signal of 1, your starting point, and you apply a gain factor of 2, the output signal will be 2, which corresponds to a gain of about 6 dB. dB is relative, not absolute. It is a measure of the change in amplitude, not the absolute value of the signal.",
        ],
        code: "gainDb = 20 * log10(gainFactor)\ny[n] = gainFactor * x[n]",
      },
      {
        id: "delay",
        title: "Delay",
        body: [
          "Delay is a simple tool that creates a time-based shift in the signal. It is achieved by storing a copy of the input signal in a buffer and playing it back after a certain amount of time.",
          "The simplest way to implement delay is by using a delay line, which is a buffer that stores a copy of the input signal and plays it back after a certain amount of time. By adjusting the delay time and the feedback level, you can create different types of delay effects, such as echo, slapback, ping-pong, and so on.",
          "Once you feed part of the delayed signal back into the delay line, you stop having only one repeat and you start having a little system that can keep talking to itself. That is why delay ends up being the basis for so many other effects.",
        ],
        code: "y[n] = x[n] + g * x[n - D]\nyFb[n] = x[n] + fb * y[n - D]",
      },
      {
        id: "panning",
        title: "Panning",
        body: [
          "Panning is the process of moving a sound from one side of the stereo field to the other. It is achieved by adjusting the balance between the left and right channels of a stereo signal. The most common way to pan a sound is to use a pan control, which is a knob or slider that adjusts the level of the left and right channels.",
          "The easiest way to implement panning is by multiplying the signal by a factor that is determined by the position of the pan control. When the pan control is centered, the signal is multiplied by a factor on both channels so the sound comes out of both speakers at the same level. When the pan control is turned to the left, the signal is multiplied by a factor that favors the left channel, and when the pan control is turned to the right, the signal is multiplied by a factor that favors the right channel.",
          "That is the simplest version. In practice many panners use an equal-power curve so the center position does not feel unnaturally loud or weak. But the core idea is still just gain distribution between channels.",
        ],
        code: "left[n] = gL * x[n]\nright[n] = gR * x[n]",
      },
      {
        id: "filter",
        title: "Filter",
        body: [
          "A filter is a tool that modifies the frequency content of a signal. There is a wide variety of filters, such as low-pass, high-pass, band-pass, notch, and so on, each of which allows certain frequencies to pass through while attenuating others.",
          "A more complete picture of a filter can be found in the EQ section, since an EQ is essentially a collection of filters. At the end of the day, a filter is just a system that decides what part of the signal survives and what part gets attenuated.",
        ],
      },
      {
        id: "eq",
        title: "EQ",
        body: [
          "An EQ, in its simplest way, is really a collection of filters. There is no such thing as a single EQ, but rather a combination of different types of filters to shape the frequency response of a signal. So when explaining EQ, one is better off explaining what a filter is.",
          "The simplest filter to picture is the comb filter, which ultimately happens in our physical world when we have reflections of sound waves. When a sound wave hits a surface, it reflects back and interferes with the original sound wave, creating a series of peaks and troughs in the frequency response that resemble the teeth of a comb. This is why it is called a comb filter.",
          "What do we learn from that? That we can create a comb filter by simply adding a delayed version of the signal to itself. Ultimately, the keyword there is delayed. The easiest filters look like a signal loop, where signals go through a series of delays and this is added back to the original signal, either in a positive or negative way, multiplying itself by a positive or negative gain factor, which in the filter world we call coefficients. By adjusting the delay time and the gain factor, you can create different types of filters, such as low-pass, high-pass, band-pass, notch, and so on.",
          "For instance, a very simple one-pole low-pass filter can be implemented with a single delay and a feedback loop. Its equation is y[n] = (1 - a) * x[n] + a * y[n - 1], where x[n] is the input signal, y[n] is the output signal, and a is the feedback coefficient that controls the cutoff behavior of the filter.",
          "There are also many different types of filters that are more complex than that. In general, a filter can be seen as a system that contains different parts, such as the feedforward path, the feedback path, the delay lines, the coefficients, and so on, which can be adjusted independently to create different types of filters. But it can also be seen as a single process that takes an input signal and produces an output signal with a modified frequency response. So a filter can be anything: a room, a microphone, a speaker, the body of an instrument, the esophagus, you name it.",
        ],
        code: "y[n] = (1 - a) * x[n] + a * y[n - 1]",
      },
      {
        id: "reverb",
        title: "Reverb",
        body: [
          "Reverb is the persistence of sound after the original sound has stopped. It is created by the reflections of sound waves off surfaces in a space, which creates a series of echoes that decay over time. The simplest way to create reverb is to use a delay line, which is a buffer that stores a copy of the input signal and plays it back after a certain amount of time. By adjusting the delay time and the feedback level, you can create different types of reverb, such as plate, hall, room, and so on.",
          "There are other types of reverbs, such as convolution reverb, which uses an impulse response of a real space to create a more realistic reverb effect. In that sense, reverb can also be seen as a filter, since it shapes the frequency response of the signal by adding reflections and echoes. Really, almost anything can be seen as a filter: a room, a microphone, a speaker, the body of an instrument, and so on.",
          "We can see reverb as a system that contains different parts, such as the early reflections, the late reflections, and the decay time, which can be adjusted independently to create different types of reverb effects. These parameters are not just simple knobs that you can adjust, but are actually the result of a complex system of delays and feedback loops that create the reverb effect.",
          "For instance, in a simple delay-based reverb, the early reflections can be created by using a series of short delay lines with low feedback, while the late reflections can be created by using longer delay lines with higher feedback. For a convolution reverb, it is a little more tricky than that, since you are using an impulse response of a real space. But one way to adjust the decay and pre-delay of a convolution reverb is by manipulating the impulse response itself, by applying a gain envelope to it, working with it at higher sample rates so you can stretch it more cleanly, or by using a filter to shape it. This is beyond what can be achieved with a simple delay line, and it is what makes reverb such a complex and versatile effect.",
          "For a delay-based reverb, mathematically, it can be represented as y[n] = x[n] + alpha * y[n - D], where x[n] is the input signal, y[n] is the output signal, alpha is the feedback gain, and D is the delay time. A convolution reverb can be represented as y[n] = x[n] * h[n], where x[n] is the input signal, y[n] is the output signal, and h[n] is the impulse response of the space being simulated.",
        ],
        code: "delay-based: y[n] = x[n] + alpha * y[n - D]\nconvolution: y[n] = x[n] * h[n]",
      },
      {
        id: "convolution",
        title: "Convolution",
        body: [
          "The convolution operation is a mathematical operation that combines the input signal with the impulse response of a system to produce the output signal. It is used in many audio processing techniques, such as filtering, reverbs, 3D audio, simulation, and so on.",
          "Mathematically, convolution can be represented as y[n] = x[n] * h[n] = sum(x[k] * h[n - k]), where x[n] is the input signal, y[n] is the output signal, h[n] is the impulse response of the system, and k is the index of summation. In simple terms, convolution is a way to apply the characteristics of one signal, the impulse response, to another signal, the input signal, to create a new signal, the output signal, that has the combined characteristics of both signals.",
          "What the equation says is that this happens by taking each sample of the input signal, multiplying it by the corresponding sample of the impulse response, and summing the results to create each sample of the output signal. Generally you do not perform convolution directly in the time domain, but rather in the frequency domain using the Fast Fourier Transform, which allows for much faster computation of the convolution operation, especially for long signals and impulse responses.",
          "And even more generally, you do not implement convolution at all, and the same often applies to the FFT. This is already implemented in libraries such as JUCE, and you just call the function that performs the convolution for you, while understanding the concept behind it. You can obviously implement your own convolution algorithm, but it is not necessary to understand the concept and to use it in your audio processing work.",
          "I think this is important to understand not only for convolution but for many other DSP processes, because if you spend too much time trying to build your own convolution algorithm, you will miss out on the opportunity to understand how to use it in your audio processing work. Needless to say, if you do want to build your own convolution algorithm, it is a great way to understand the concept and to learn how to implement it. It depends on what kind of mind you have and how you learn best. But in my experience, understanding the concept and using it in your audio processing work is more important than building your own algorithm first.",
        ],
        code: "y[n] = x[n] * h[n] = sum(x[k] * h[n - k])",
      },
      {
        id: "cross-correlation",
        title: "Cross-Correlation",
        body: [
          "Cross-correlation is a mathematical operation that measures the similarity between two signals as a function of the time lag applied to one of them. It is used in many audio processing techniques, such as time-delay estimation, pitch detection, and source separation.",
          "Mathematically, cross-correlation can be represented as Rxy[k] = sum(x[n] * y[n - k]), where x[n] and y[n] are the two signals being compared, Rxy[k] is the cross-correlation function, and k is the time lag applied to one of the signals.",
          "In simple terms, cross-correlation is a way to measure how similar two signals are by shifting one signal in time and calculating the sum of the products of the two signals at each time lag. The value of Rxy[k] will be highest when the two signals are most similar, which can be used to estimate the time delay between the two signals, to detect the pitch of a signal by comparing it to a reference signal, or to separate sources in a mixture by comparing the mixed signal to the individual source signals.",
          "It is closely related to convolution, in the sense that while convolution combines two signals to create a new signal, cross-correlation compares two signals to measure their similarity. If you want a cool tool, check out our plugin DidiCompensate, which uses a variant of cross-correlation to compensate for delay introduced in real-world audio recording settings such as film production.",
        ],
        code: "Rxy[k] = sum(x[n] * y[n - k])",
      },
    ],
  },
  {
    title: "Dynamics",
    topics: [
      {
        id: "compression",
        title: "Compression",
        body: [
          "This is a tool that confuses almost everybody initially getting started in audio engineering. Primarily because of the tool itself and the hearing curve, meaning the time you spend not only understanding compression parameters, but also learning how to recognize compression when listening to it.",
          "However, just like the EQ, a compressor is not a single thing, but a system that contains different parts. Perhaps by understanding the different parts, at least the parameters become more intuitive to use. A very simple compressor contains the following: envelope follower, gain computer, gain smoother, and DCA.",
          "A simple digital compressor contains two signal paths. One is the analysis path, the second is the processing path. The original sound goes into the analysis path, whose first step is the envelope follower. The envelope follower as well is a system that has two components: a rectifier and a low-pass filter.",
          "The rectifier takes the absolute value of the input signal, so that we are only working with positive values, since we are only interested in the amplitude of the signal, not the phase. In other words, the rectifier takes your audio signal and turns it into a positive-only signal that represents the amplitude of the original signal. Mathematically, the rectifier can be implemented as y[n] = abs(x[n]), where x[n] is the input signal and y[n] is the output signal.",
          "The output of the rectifier then goes into a low-pass filter, which smooths out the signal and creates a more stable representation of the amplitude over time. In other words, the signal changes amplitude very fast, which can create a very erratic gain reduction if we were to use the output of the rectifier directly. Mathematically, the low-pass filter can be implemented as y[n] = (1 - a) * x[n] + a * y[n - 1], where x[n] is the input signal, y[n] is the output signal, and a is the feedback coefficient that controls the smoothing. Small a values will create a faster response, while larger a values will create a slower response. A real envelope follower usually uses two different coefficients, one for the attack time and one for the release time, to create a more natural response to the input signal.",
          "The output of the envelope follower, which is the envelope of the input signal, then goes into the gain computer, which calculates the amount of gain reduction that needs to be applied to the input signal based on the threshold and ratio parameters of the compressor. The threshold is the level at which the compressor starts to apply gain reduction, and the ratio is the amount of gain reduction that is applied once the signal exceeds the threshold.",
          "For example, if the threshold is set to -10 dB and the ratio is set to 4:1, then for every 4 dB that the input signal exceeds the threshold, the output signal will only exceed the threshold by 1 dB. Or a simpler way to look at the ratio, which is often overlooked, is that for every dB that the input signal exceeds the threshold, the output signal will only exceed the threshold by 1 divided by the ratio in dB. So if the input signal exceeds the threshold by 8 dB, and the ratio is 4:1, then the output signal will only exceed the threshold by 2 dB.",
          "The output of the gain computer, gainDb, then goes into the gain smoother, which again can be a single-pole low-pass filter. It smooths out the gain reduction over time and avoids sudden changes in gain that can create artifacts in the output signal. Finally, the output of the gain smoother, smoothedGainDb, goes into the DCA, the digitally controlled amplifier, which applies the gain reduction to the input signal coming from the processing path. Essentially, a compressor is an automated gain control system.",
        ],
        code:
          "env[n] = (1 - a) * abs(x[n]) + a * env[n - 1]\n" +
          "gainDb = gainComputer(env[n], threshold, ratio)\n" +
          "smoothedGainDb[n] = (1 - b) * gainDb + b * smoothedGainDb[n - 1]\n" +
          "y[n] = x[n] * 10^(smoothedGainDb[n] / 20)",
      },
      {
        id: "limiting",
        title: "Limiting",
        body: [
          "A limiter is a type of compressor that has an infinite ratio, which means that once the input signal exceeds the threshold, the output signal will not exceed the threshold at all. In other words, a limiter is a compressor that completely prevents the output signal from exceeding the threshold level.",
          "The main purpose of a limiter is to prevent clipping and distortion in the output signal by ensuring that the signal does not exceed a certain level.",
          "The demo uses an ideal gain reduction model for a steady tone. A real limiter follows the signal over time using peak detection, lookahead, and gain smoothing. Directly cutting off each sample at the threshold is hard clipping, which reshapes the waveform.",
        ],
        code:
          "peak = detectedPeakAmplitude\n" +
          "gain = min(1, ceilingAmplitude / max(peak, epsilon))\n" +
          "y[n] = gain * x[n]",
      },
      {
        id: "noise-gate",
        title: "Noise Gate",
        body: [
          "A noise gate is the opposite of a compressor in the basic sense that it attenuates low-level material instead of reducing high-level material. It is a dynamic processor that attenuates the signal when it falls below a certain threshold level.",
          "Mathematically, a very simple noise gate can be implemented by letting the signal pass when its level is above the threshold and muting it when it falls below the threshold.",
          "Of course, a real noise gate is usually less brutal than that. It will often include attack, hold, and release behavior so the opening and closing feel natural instead of abrupt.",
        ],
        code:
          "env[n] = envelopeFollower(x[n])\n" +
          "gainDb = 0 if env[n] >= threshold else -closedAttenuationDb\n" +
          "y[n] = x[n] * 10^(gainDb / 20)",
      },
      {
        id: "expansion",
        title: "Expansion",
        body: [
          "An expander can be thought of as going in the opposite direction from compression. Instead of reducing dynamic contrast, it increases it. Depending on the design, it can make loud things relatively louder, quiet things relatively quieter, or both.",
          "One loose way to picture it is that you are multiplying the signal by a factor greater than 1 above a threshold, or attenuating lower-level material further below the threshold, depending on the type of expander you are using. That is why noise gates and expanders belong to the same family, even though a gate is a much more abrupt version.",
          "Like with compression, the real usefulness is in the behavior over time. A mathematically simple rule is easy to write, but attack, release, and smoothing are what make the process sound usable instead of jumpy.",
          "The demo and example below show downward expansion: levels below the threshold are attenuated, while levels above it pass unchanged.",
        ],
        code:
          "if xDb < thresholdDb:\n" +
          "  yDb = thresholdDb + (xDb - thresholdDb) * ratio\n" +
          "else:\n" +
          "  yDb = xDb",
      },
      {
        id: "multiband-compression",
        title: "Multiband Compression",
        body: [
          "Multiband compression is a type of compression that divides the frequency spectrum into multiple bands and applies compression to each band independently. This allows for more precise control over the dynamics of different frequency ranges in the signal.",
          "For example, you can apply more compression to the low frequencies to control the bass, while applying less compression to the high frequencies to preserve the clarity of the vocals.",
          "Mathematically, multiband compression can be implemented by first splitting the input signal into multiple frequency bands using filters, such as crossovers or band-pass filters, then applying a compressor to each band independently, and finally summing the output of each band back together to create the final output signal.",
        ],
        code:
          "bands = splitWithFilters(x)\n" +
          "compressedBands[i] = compress(bands[i])\n" +
          "y[n] = sum(compressedBands[i])",
      },
      {
        id: "de-essing",
        title: "De-Essing",
        body: [
          "De-essing is a type of dynamic processing used to reduce excessive sibilance. It is commonly implemented by detecting energy in a selected high-frequency band and applying gain reduction when that band exceeds a threshold.",
          "The gain reduction may be applied either to the whole signal, broadband de-essing, or only to the sibilant band, split-band de-essing. The detection of sibilance can be achieved by using a band-pass filter to isolate the high-frequency content, and then using an envelope follower to measure the amplitude of that content.",
          "When the amplitude exceeds a certain threshold, gain reduction is applied to the signal, or to the sibilant band, to reduce the sibilance. So in practice, a de-esser is really a frequency-selective compressor.",
        ],
      },
    ],
  },
  {
    title: "Nonlinear Color",
    topics: [
      {
        id: "saturation",
        title: "Saturation",
        body: [
          "Saturation is a type of audio processing that adds harmonic content to a signal. This is also known as harmonic distortion, and it can create a warm and rich sound, or a more aggressive and edgy sound, depending on the amount of saturation applied.",
          "Unlike a clean gain stage, which simply multiplies the signal by a factor, saturation starts to bend the waveform as it gets louder. Instead of the peaks passing through unchanged, they begin to round off, and that rounding is what creates the extra harmonics that we hear as warmth, thickness, edge, or simply more character.",
          "In that sense, saturation can be seen as a softer and often more musical form of distortion. Mathematically, saturation can be implemented by applying a nonlinear function to the input signal, such as a soft-clipping function or a waveshaping function.",
          "Where drive controls how hard you push the signal into the nonlinear curve, and mix lets you blend the saturated signal with the original one. The harder you push it, the more harmonics you create.",
        ],
        code:
          "driven[n] = drive * x[n]\n" +
          "wet[n] = tanh(driven[n]) / tanh(drive)\n" +
          "y[n] = mix * wet[n] + (1 - mix) * x[n]",
      },
      {
        id: "distortion",
        title: "Distortion",
        body: [
          "Distortion is a type of audio processing that introduces harmonic content to a signal, creating a more aggressive and edgy sound. It is often used to add character to guitars or drums.",
          "Mathematically, distortion can be implemented by applying a nonlinear function to the input signal, such as a hard-clipping function or a waveshaping function. In practice, one way to look at the difference between saturation and distortion is how hard you are reshaping the waveform.",
          "Saturation tends to round the peaks more gently, while distortion often clips or bends the waveform more aggressively, which creates stronger upper harmonics and a rougher sound. In many plugins this is not just one function, but a little system: input gain, nonlinear stage, tone shaping, and output gain.",
          "Where drive pushes the signal into the clipper, and threshold is the clipping threshold. The lower the threshold, the sooner the waveform is cut.",
        ],
        code:
          "pre[n] = drive * x[n]\n" +
          "y[n] = max(-threshold, min(pre[n], threshold))",
      },
      {
        id: "aliasing",
        title: "Aliasing",
        body: [
          "Aliasing is one of those concepts that everybody hears about, but it can sound abstract until you run into it in a bad distortion or synthesizer. In simple terms, if a digital system creates frequencies above half the sample rate, those frequencies cannot be represented correctly, so they fold back into the audible range as false frequencies.",
          "That is why aliasing can sound metallic, fizzy, or just strangely wrong. The important limit is the Nyquist frequency.",
          "Any frequency content generated above that limit will fold back into the band as aliasing.",
        ],
        code: "fN = Fs / 2",
      },
      {
        id: "oversampling",
        title: "Oversampling",
        body: [
          "Oversampling is one of the most common tricks to reduce aliasing in nonlinear processors such as saturation, distortion, clipping, or some types of synthesis. The idea is simple: temporarily run the process at a higher sample rate, do the dirty work there, filter the result, and then come back down to the original sample rate.",
          "In plain terms, you are giving the new harmonics more room to exist before they fold back. If you oversample by a factor M, then the temporary sample rate becomes Fs_over = M * Fs.",
          "That does not magically remove distortion. It just makes the distortion cleaner by reducing fold-back artifacts.",
        ],
        code: "Fs_over = M * Fs",
      },
    ],
  },
  {
    title: "Modulation and Space",
    topics: [
      {
        id: "lfo",
        title: "LFO",
        body: [
          "An LFO is a low-frequency oscillator. It is just an oscillator running slowly enough that you usually do not hear it as pitch, but rather feel it as movement.",
          "Instead of sending the LFO straight to the speakers, you use it to move another parameter over time, such as delay time, pan position, filter cutoff, or amplitude. In that sense, many modulation effects are really some other process being moved around by an LFO.",
          "Where fLFO is the LFO frequency and depth determines how much movement you apply to the parameter.",
        ],
        code:
          "lfo[n] = sin(2 * pi * fLFO * n / Fs)\n" +
          "parameter[n] = center + depth * lfo[n]",
      },
      {
        id: "modulation-effects",
        title: "Modulation Effects",
        body: [
          "Modulation effects are audio processing techniques that vary a signal's parameters over time, creating dynamic and evolving sounds. Examples include chorus, flanger, and phaser effects.",
          "What they all have in common is that something inside the system is moving while the sound passes through it. Very often the moving hand behind the curtain is an LFO. You are not just delaying or filtering the signal, you are changing the delay or filter over time. That is what creates the swirl, shimmer, and sweep.",
          "This single idea already gets you close to chorus and flanger.",
        ],
        code:
          "D[n] = D0 + depth * sin(2 * pi * fLFO * n / Fs)\n" +
          "y[n] = x[n] + g * x[n - D[n]]",
      },
      {
        id: "chorus",
        title: "Chorus",
        body: [
          "A chorus effect works by mixing the original signal with one or more slightly delayed and continuously modulated copies. Because the delay times are usually a little longer than in a flanger, you tend to hear thickness and width rather than a strong comb-filter sweep.",
          "It is a way of making one sound behave more like several similar sounds happening at once.",
          "Where D0 is usually a few milliseconds long, and the modulation keeps the delayed copy from sounding static.",
        ],
        code:
          "D[n] = D0 + depth * sin(2 * pi * fLFO * n / Fs)\n" +
          "y[n] = x[n] + g * x[n - D[n]]",
      },
      {
        id: "flanger",
        title: "Flanger",
        body: [
          "A flanger is very close to a chorus, but the delay times are much shorter, so instead of mainly hearing thickness, you hear a moving comb filter.",
          "If you add feedback, the notches and peaks become more pronounced, which gives that jet-like sweep that people associate with flanging.",
          "The idea is still a moving delay, but now you are working in a range where the delay starts to act like a moving filter.",
        ],
        code:
          "D[n] = D0 + depth * sin(2 * pi * fLFO * n / Fs)\n" +
          "y[n] = x[n] + g * x[n - D[n]] + fb * y[n - D[n]]",
      },
      {
        id: "phaser",
        title: "Phaser",
        body: [
          "A phaser reaches a similar kind of movement, but it does it with all-pass filters instead of short delay lines. An all-pass filter changes the phase of the signal without simply acting like a normal EQ.",
          "When you mix that phase-shifted signal back with the dry signal, moving notches appear in the spectrum, and that is what gives the phaser its swooshing character.",
          "In practice, phasers usually use several all-pass stages in series so the notches become more interesting and more obvious.",
        ],
        code:
          "a[n] = -g * x[n] + x[n - 1] + g * a[n - 1]\n" +
          "y[n] = mix * a[n] + (1 - mix) * x[n]",
      },
      {
        id: "time-based-effects",
        title: "Time-Based Effects",
        body: [
          "Time-based effects are audio processing techniques that manipulate the timing of audio signals, creating delays, echoes, and other temporal effects. Examples include reverb, delay, and echo effects.",
          "One way to see all time-based effects is as memory systems. They remember the signal for some amount of time and bring it back later, once or many times. If there is no feedback, you hear one delayed copy. If there is feedback, the system keeps feeding itself and you hear repeating echoes or decaying trails.",
          "That is why delay and reverb are cousins.",
        ],
        code:
          "y[n] = x[n] + g * x[n - D] + fb * y[n - D]",
      },
      {
        id: "spatial-effects",
        title: "Spatial Effects",
        body: [
          "Spatial effects are audio processing techniques that manipulate the perceived location and movement of sound sources in a stereo or surround sound field. Examples include panning, reverb, and binaural processing.",
          "Spatial effects are really about convincing the ear that the left and right sides are not receiving the exact same information. That difference can come from level, arrival time, frequency response, phase, or a combination of all of them.",
          "A basic pan control is the simplest spatial effect. A binaural system is a much more elaborate one.",
        ],
        code:
          "left[n] = gL * x[n]\n" +
          "right[n] = gR * x[n - D]",
      },
    ],
  },
  {
    title: "Signal Flow in Practice",
    topics: [
      {
        id: "mixing",
        title: "Mixing",
        body: [
          "Mixing can refer to two different things. It can refer to the process of combining multiple audio signals together to create a single output signal, which is what we will discuss here, or it can refer to the process of adjusting the levels, panning, and effects of individual tracks in a multitrack recording to create a final result, which is more of an artistic process, and in fact a point of contention.",
          "Many Broadway engineers will likely call a mixer the person who moves, and only moves, the faders and, if experienced, maybe a couple of knobs. The sound designer, they would say, is the person who is in charge of all the other aspects of the audio production, including effects. And this makes a lot of sense, since in a Broadway show the sound designer is the one who is in charge of the overall sound of the show, and effects can alter the sound in a significant way.",
          "Whereas in the world of film production, one could easily argue that the boom operator is the first mixer, since their movements can easily dictate what the final sound level will be. So you can see how the term mixing can be used in different ways and how tricky it can be, and it is important to clarify what we are referring to when we use the term.",
          "In the context of this article, we will refer to mixing as the process of combining multiple audio signals together to create a single output signal. This is typically achieved by summing the individual signals together. Another way to see mixing, as with a system that alters the original signal, is as weighted summation. You are not merely adding sounds together, you are deciding how much of each sound survives in the final picture.",
          "In that sense, mixing is gain, panning, EQ, dynamics, and effects all interacting before the final sum.",
        ],
        code:
          "y[n] = g1 * x1[n] + g2 * x2[n] + ... + gN * xN[n]",
      },
      {
        id: "conclusion",
        title: "Conclusion",
        body: [
          "At the end of the day, all of these glamorous names are really different ways of acting on a list of numbers over time. Some processes store the numbers, some compare them, some smooth them, some bend them, and some add them together.",
          "Once you start to see the little systems underneath the knobs, the mystery does not disappear completely, but it becomes much more manageable, and that is usually where real understanding begins.",
        ],
      },
    ],
  },
];
